import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import familyData from "./data/family.json";
import type { Person, FamilyData, SearchResult } from "./types";
import SearchBar from "./components/SearchBar";
import BranchNav from "./components/BranchNav";
import TreeView from "./components/TreeView";
import GridView from "./components/GridView";
import PersonDetail from "./components/PersonDetail";
import AppNav from "./components/AppNav";
import DirectoryView from "./components/DirectoryView";
import StoriesView from "./components/StoriesView";
import CemeteryView from "./components/CemeteryView";
import HeroSection from "./components/HeroSection";
import FamilyOrbit from "./components/FamilyOrbit";
import ArchivesView from "./components/ArchivesView";
import MediaStrip from "./components/MediaStrip";
import externalResources from "./data/externalResources.json";
import { getPeople, getBranchPeople, getRelatives, getInnerCircle } from "./utils/people";
import { searchAll, findPersonById } from "./utils/search";

const data = familyData as FamilyData;
const allPeople = getPeople(data);
const ROOT_ID = data.meta.rootPersonId ?? "wixted-114-29";
const rootPerson = findPersonById(data, ROOT_ID)!;

function AppContent() {
  const navigate = useNavigate();
  const { personId } = useParams();
  const mainRef = useRef<HTMLElement>(null);
  const [activeBranch, setActiveBranch] = useState("wixted");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [appView, setAppView] = useState<"explore" | "directory" | "stories" | "cemetery" | "archives">("explore");
  const [showOrbit, setShowOrbit] = useState(true);

  const selected = useMemo(
    () => (personId ? findPersonById(data, personId) ?? null : null),
    [personId]
  );

  const innerCircle = useMemo(() => getInnerCircle(ROOT_ID, allPeople), []);

  useEffect(() => {
    if (selected) {
      setActiveBranch(selected.branch);
      setViewMode(selected.branch === "wixted" ? "tree" : "grid");
    }
  }, [selected]);

  const branchPeople = useMemo(() => getBranchPeople(data, activeBranch), [activeBranch]);
  const searchResults = useMemo(() => searchAll(data, searchQuery), [searchQuery]);
  const relatives = useMemo(() => (selected ? getRelatives(selected, allPeople) : []), [selected]);

  const selectPerson = useCallback(
    (p: Person) => {
      navigate(`/person/${p.id}`);
      setAppView("explore");
    },
    [navigate]
  );

  const handleSearchSelect = useCallback(
    (r: SearchResult) => {
      setSearchQuery("");
      if (r.type === "person" && r.person) selectPerson(r.person);
      else if (r.type === "story" && r.story?.personIds[0]) {
        const p = findPersonById(data, r.story.personIds[0]);
        if (p) selectPerson(p);
        else setAppView("stories");
      } else if (r.type === "cemetery" || r.type === "location") setAppView("cemetery");
    },
    [selectPerson]
  );

  const closeDetail = useCallback(() => navigate("/"), [navigate]);
  const scrollToExplore = () => mainRef.current?.scrollIntoView({ behavior: "smooth" });

  const activeBranchMeta = data.branches.find((b) => b.id === activeBranch);
  const hasTree = activeBranch === "wixted";
  const focusLine = data.meta.focusLine;

  return (
    <div className="app">
      <header className="app-header">
        <HeroSection
          person={rootPerson}
          heritage={data.heritage.matthew ?? data.heritage.katie}
          personCount={data.meta.personCount ?? allPeople.length}
          storyCount={data.stories?.length ?? 0}
          branchCount={data.branches.length}
          onExplore={scrollToExplore}
        />

        <div className="search-row">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            onSelect={handleSearchSelect}
            onClose={() => setSearchQuery("")}
          />
        </div>

        <AnimatePresence>
          {showOrbit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="orbit-section"
            >
              <div className="orbit-header">
                <h2>Matthew's Circle</h2>
                <button onClick={() => setShowOrbit(false)} aria-label="Hide family circle">✕</button>
              </div>
              <FamilyOrbit root={rootPerson} family={innerCircle} onSelect={selectPerson} />
            </motion.div>
          )}
        </AnimatePresence>

        {!showOrbit && (
          <button className="show-orbit-btn" onClick={() => setShowOrbit(true)}>
            Show Matthew's Circle
          </button>
        )}

        <MediaStrip
          onViewCemetery={() => { setAppView("cemetery"); scrollToExplore(); }}
          onViewStories={() => { setAppView("stories"); scrollToExplore(); }}
          onViewArchives={() => { setAppView("archives"); scrollToExplore(); }}
        />
      </header>

      <main className="main" ref={mainRef}>
        <AppNav
          active={appView}
          onChange={setAppView}
          counts={{
            people: data.meta.personCount ?? allPeople.length,
            stories: data.stories?.length ?? 0,
            cemetery: data.cemetery.length,
            archives: externalResources.resources.length,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={appView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="view-content"
          >
            {appView === "explore" && (
              <>
                <div className="main-header">
                  <div className="main-header-left">
                    <h2>{activeBranchMeta?.label}</h2>
                    <p className="branch-desc">{activeBranchMeta?.desc}</p>
                  </div>
                  <div className="view-toggle">
                    {hasTree && (
                      <>
                        <button className={viewMode === "tree" ? "active" : ""} onClick={() => setViewMode("tree")}>Tree</button>
                        <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>Grid</button>
                      </>
                    )}
                  </div>
                </div>

                <BranchNav
                  branches={data.branches}
                  active={activeBranch}
                  onSelect={(id) => {
                    setActiveBranch(id);
                    closeDetail();
                    setViewMode(id === "wixted" ? "tree" : "grid");
                  }}
                />

                <div className="main-content">
                  {hasTree && viewMode === "tree" ? (
                    <TreeView
                      people={branchPeople}
                      selectedId={selected?.id ?? null}
                      highlightId={selected?.id ?? null}
                      focusLine={focusLine}
                      onSelect={selectPerson}
                    />
                  ) : (
                    <GridView
                      people={branchPeople}
                      selectedId={selected?.id ?? null}
                      focusLine={focusLine}
                      onSelect={selectPerson}
                    />
                  )}
                </div>
              </>
            )}

            {appView === "directory" && (
              <DirectoryView
                people={allPeople}
                branches={data.branches}
                selectedId={selected?.id ?? null}
                onSelect={selectPerson}
              />
            )}

            {appView === "stories" && (
              <StoriesView
                stories={data.stories ?? []}
                branches={data.branches}
                people={allPeople}
                onSelectPerson={selectPerson}
              />
            )}

            {appView === "cemetery" && (
              <CemeteryView
                cemetery={data.cemetery}
                locationRefs={data.locationRefs ?? []}
                people={allPeople}
                onSelectPerson={selectPerson}
              />
            )}

            {appView === "archives" && (
              <ArchivesView people={allPeople} onSelectPerson={selectPerson} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="footer">
        <span>Wixted Family Tree {data.meta.version}</span>
        <span>Updated {data.meta.updated}</span>
        <span>Curated for {data.meta.focus}</span>
      </footer>

      <PersonDetail
        person={selected}
        cemetery={data.cemetery}
        relatives={relatives}
        stories={data.stories ?? []}
        branches={data.branches}
        onClose={closeDetail}
        onSelectRelative={selectPerson}
      />

      <style>{`
        .app { min-height: 100vh; display: flex; flex-direction: column; }
        .app-header { position: relative; }
        .search-row {
          display: flex; justify-content: center;
          padding: 0 48px 20px;
        }
        .orbit-section {
          padding: 0 48px 24px; max-width: 1200px; margin: 0 auto; width: 100%;
          overflow: hidden;
        }
        .orbit-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .orbit-header h2 {
          font-family: var(--font-display); font-size: 20px; font-weight: 600;
          color: var(--text-secondary);
        }
        .orbit-header button {
          color: var(--text-tertiary); font-size: 14px; padding: 4px 8px;
          border-radius: 6px; transition: background 0.15s;
        }
        .orbit-header button:hover { background: var(--bg-glass); }
        .show-orbit-btn {
          display: block; margin: 0 auto 16px;
          padding: 8px 20px; font-size: 13px; color: var(--accent);
          border: 1px solid var(--border-accent); border-radius: 980px;
        }
        .main {
          flex: 1; padding: 0 48px 32px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .view-content { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .main-header {
          display: flex; justify-content: space-between; align-items: flex-end;
        }
        .main-header h2 {
          font-family: var(--font-display);
          font-size: 28px; font-weight: 700;
        }
        .branch-desc { font-size: 15px; color: var(--text-secondary); margin-top: 4px; }
        .view-toggle {
          display: flex; gap: 2px; background: var(--bg-glass);
          border-radius: 10px; padding: 3px; border: 1px solid var(--border);
        }
        .view-toggle button {
          padding: 6px 16px; border-radius: 8px; font-size: 13px;
          font-weight: 500; color: var(--text-secondary); transition: all 0.2s;
        }
        .view-toggle button.active {
          background: var(--bg-elevated); color: var(--accent-bright);
          box-shadow: var(--shadow-sm);
        }
        .main-content { flex: 1; min-height: 0; }
        .footer {
          display: flex; justify-content: center; gap: 24px;
          padding: 24px; font-size: 12px; color: var(--text-tertiary);
          border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .search-row { padding: 0 20px 16px; }
          .orbit-section { padding: 0 20px 20px; }
          .main { padding: 0 20px 24px; }
          .main-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer { flex-direction: column; align-items: center; gap: 8px; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/person/:personId" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

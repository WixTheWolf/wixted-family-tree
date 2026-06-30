import { useState, useMemo, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import familyData from "./data/family.json";
import type { Person, FamilyData, SearchResult } from "./types";
import SearchBar from "./components/SearchBar";
import BranchNav from "./components/BranchNav";
import TreeView from "./components/TreeView";
import GridView from "./components/GridView";
import PersonDetail from "./components/PersonDetail";
import HeritageChart from "./components/HeritageChart";
import AppNav from "./components/AppNav";
import DirectoryView from "./components/DirectoryView";
import StoriesView from "./components/StoriesView";
import CemeteryView from "./components/CemeteryView";
import { getPeople, getBranchPeople, getRelatives } from "./utils/people";
import { searchAll, findPersonById } from "./utils/search";

const data = familyData as FamilyData;
const allPeople = getPeople(data);

function AppContent() {
  const navigate = useNavigate();
  const { personId } = useParams();
  const [activeBranch, setActiveBranch] = useState("wixted");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [appView, setAppView] = useState<"explore" | "directory" | "stories" | "cemetery">("explore");

  const selected = useMemo(
    () => (personId ? findPersonById(data, personId) ?? null : null),
    [personId]
  );

  useEffect(() => {
    if (selected) {
      setActiveBranch(selected.branch);
      setViewMode(selected.branch === "wixted" ? "tree" : "grid");
    }
  }, [selected]);

  const branchPeople = useMemo(
    () => getBranchPeople(data, activeBranch),
    [activeBranch]
  );

  const searchResults = useMemo(
    () => searchAll(data, searchQuery),
    [searchQuery]
  );

  const relatives = useMemo(
    () => (selected ? getRelatives(selected, allPeople) : []),
    [selected]
  );

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
      if (r.type === "person" && r.person) {
        selectPerson(r.person);
      } else if (r.type === "story" && r.story?.personIds[0]) {
        const p = findPersonById(data, r.story.personIds[0]);
        if (p) selectPerson(p);
        else setAppView("stories");
      } else if (r.type === "cemetery") {
        setAppView("cemetery");
      } else if (r.type === "location") {
        setAppView("cemetery");
      }
    },
    [selectPerson]
  );

  const closeDetail = useCallback(() => navigate("/"), [navigate]);

  const activeBranchMeta = data.branches.find((b) => b.id === activeBranch);
  const hasTree = activeBranch === "wixted";

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>{data.meta.title}</h1>
          <p className="hero-sub">
            Explore {data.meta.personCount ?? allPeople.length} ancestors across{" "}
            {data.branches.length} family branches — with {(data.stories ?? []).length} stories
            and {data.cemetery.length} cemetery records.
            <span className="hero-focus"> Focused on {data.meta.focus}.</span>
          </p>
        </div>

        <div className="hero-actions">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            onSelect={handleSearchSelect}
            onClose={() => setSearchQuery("")}
          />
        </div>

        <div className="heritage-row">
          <HeritageChart heritage={data.heritage.katie} name="Katie" />
          <HeritageChart heritage={data.heritage.kevin} name="Kevin" />
        </div>
      </header>

      <main className="main">
        <AppNav
          active={appView}
          onChange={setAppView}
          counts={{
            people: data.meta.personCount ?? allPeople.length,
            stories: data.stories?.length ?? 0,
            cemetery: data.cemetery.length,
          }}
        />

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
                    <button
                      className={viewMode === "tree" ? "active" : ""}
                      onClick={() => setViewMode("tree")}
                    >
                      Tree
                    </button>
                    <button
                      className={viewMode === "grid" ? "active" : ""}
                      onClick={() => setViewMode("grid")}
                    >
                      Grid
                    </button>
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
                  highlightId={null}
                  onSelect={selectPerson}
                />
              ) : (
                <GridView
                  people={branchPeople}
                  selectedId={selected?.id ?? null}
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
      </main>

      <footer className="footer">
        <span>Wixted Family Tree {data.meta.version}</span>
        <span>Updated {data.meta.updated}</span>
        <span>{allPeople.length} people · {(data.stories ?? []).length} stories</span>
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
        .hero {
          padding: 48px 48px 32px; text-align: center;
          background: linear-gradient(180deg, #fff 0%, var(--bg) 100%);
        }
        .hero h1 {
          font-size: clamp(36px, 5vw, 56px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1.1;
          background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 19px; color: var(--text-secondary); margin-top: 12px;
          line-height: 1.5; max-width: 680px; margin-left: auto; margin-right: auto;
        }
        .hero-focus { color: var(--accent); -webkit-text-fill-color: var(--accent); }
        .hero-actions {
          display: flex; justify-content: center; margin-top: 28px;
        }
        .heritage-row {
          display: flex; gap: 32px; justify-content: center;
          margin-top: 32px; flex-wrap: wrap;
        }
        .heritage-row > div { min-width: 220px; max-width: 280px; }
        .main {
          flex: 1; padding: 0 48px 32px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .main-header {
          display: flex; justify-content: space-between; align-items: flex-end;
        }
        .main-header h2 {
          font-size: 28px; font-weight: 700; letter-spacing: -0.02em;
        }
        .branch-desc {
          font-size: 15px; color: var(--text-secondary); margin-top: 4px;
        }
        .view-toggle {
          display: flex; gap: 2px; background: rgba(0,0,0,0.04);
          border-radius: 10px; padding: 3px;
        }
        .view-toggle button {
          padding: 6px 16px; border-radius: 8px; font-size: 13px;
          font-weight: 500; color: var(--text-secondary); transition: all 0.2s;
        }
        .view-toggle button.active {
          background: var(--bg-elevated); color: var(--text);
          box-shadow: var(--shadow-sm);
        }
        .main-content { flex: 1; min-height: 0; }
        .footer {
          display: flex; justify-content: center; gap: 24px;
          padding: 24px; font-size: 12px; color: var(--text-tertiary);
          border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .hero { padding: 32px 20px 24px; }
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

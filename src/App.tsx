import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import familyData from "./data/family.json";
import type { Person, FamilyData, SearchResult } from "./types";
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
import ContributeView from "./components/ContributeView";
import GalleryView from "./components/GalleryView";
import SiteHeader from "./components/SiteHeader";
import AncestorJourney from "./components/AncestorJourney";
import QuickAccessHub from "./components/QuickAccessHub";
import type { AppView } from "./components/QuickAccessHub";
import FeaturedStories from "./components/FeaturedStories";
import HeraldrySection from "./components/HeraldrySection";
import HeritageOverview from "./components/HeritageOverview";
import MigrationMap from "./components/MigrationMap";
import ArchivesPreview from "./components/ArchivesPreview";
import SiteFooter from "./components/SiteFooter";
import externalResources from "./data/externalResources.json";
import type { Story } from "./types";
import { useCloudAssets } from "./context/CloudAssetsContext";
import { useContributions } from "./context/ContributionsContext";
import { getAllAssets } from "./utils/assets";
import { getPeople, getBranchPeople, getRelatives, getInnerCircle } from "./utils/people";
import { searchAll, findPersonById } from "./utils/search";

const data = familyData as FamilyData;
const allPeople = getPeople(data);
const ROOT_ID = data.meta.rootPersonId ?? "wixted-114-29";
const rootPerson = findPersonById(data, ROOT_ID)!;

function AppContent() {
  const navigate = useNavigate();
  const { personId } = useParams();
  const { contributions } = useContributions();
  const { cloudAssets } = useCloudAssets();
  const galleryCount = useMemo(
    () => getAllAssets(contributions, cloudAssets).length,
    [contributions, cloudAssets]
  );
  const mainRef = useRef<HTMLElement>(null);
  const [activeBranch, setActiveBranch] = useState("wixted");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");
  const [appView, setAppView] = useState<AppView>("explore");
  const [showOrbit, setShowOrbit] = useState(true);

  const peopleById = useMemo(
    () => new Map(allPeople.map((p) => [p.id, p])),
    []
  );

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

  const navigateTo = useCallback((view: AppView) => {
    setAppView(view);
    scrollToExplore();
  }, []);

  const goHome = useCallback(() => {
    closeDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeDetail]);

  const activeBranchMeta = data.branches.find((b) => b.id === activeBranch);
  const hasTree = activeBranch === "wixted";
  const focusLine = data.meta.focusLine;

  const goGallery = () => navigateTo("gallery");
  const goStories = () => navigateTo("stories");
  const goArchives = () => navigateTo("archives");

  const handleFeaturedStory = useCallback(
    (story: Story) => {
      if (story.personIds[0]) {
        const p = findPersonById(data, story.personIds[0]);
        if (p) selectPerson(p);
        else goStories();
      } else goStories();
    },
    [selectPerson]
  );

  const matthewHeritage = data.heritage?.matthew ?? {};

  return (
    <div className="app">
      <SiteHeader
        activeView={appView}
        onNavigate={navigateTo}
        onHome={goHome}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        searchResults={searchResults}
        onSearchSelect={handleSearchSelect}
        onSearchClose={() => setSearchQuery("")}
      />

      <header className="app-hero">
        <HeroSection
          person={rootPerson}
          personCount={data.meta.personCount ?? allPeople.length}
          storyCount={data.stories?.length ?? 0}
          galleryCount={galleryCount}
          onExplore={scrollToExplore}
          onGallery={goGallery}
        />

        <QuickAccessHub
          counts={{
            people: data.meta.personCount ?? allPeople.length,
            stories: data.stories?.length ?? 0,
            cemetery: data.cemetery.length,
            archives: externalResources.resources.length,
            gallery: galleryCount,
            contributions: contributions.length,
          }}
          onNavigate={navigateTo}
          onInnerCircle={() => {
            setShowOrbit(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <AnimatePresence>
          {showOrbit && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="orbit-section"
            >
              <div className="orbit-header">
                <div>
                  <p className="section-eyebrow">Inner circle</p>
                  <h2 className="orbit-title">Matthew&apos;s family</h2>
                </div>
                <button type="button" className="orbit-dismiss" onClick={() => setShowOrbit(false)}>
                  Hide
                </button>
              </div>
              <FamilyOrbit root={rootPerson} family={innerCircle} onSelect={selectPerson} />
            </motion.section>
          )}
        </AnimatePresence>

        {!showOrbit && (
          <button type="button" className="show-orbit-btn" onClick={() => setShowOrbit(true)}>
            Show inner circle
          </button>
        )}

        <HeritageOverview
          heritage={matthewHeritage}
          note="English, Irish, Swedish, and German through the Wixted and Jones lines. No Mexican component — that enters through Uncle Kevin's ex-wife Angela's Amor/Montez line (cousin Katie's chart)."
        />

        <HeraldrySection />

        <MigrationMap />

        <FeaturedStories
          stories={data.stories ?? []}
          onViewAll={goStories}
          onSelectStory={handleFeaturedStory}
        />

        <ArchivesPreview
          resources={externalResources.resources}
          onViewAll={goArchives}
        />

        <AncestorJourney peopleById={peopleById} onSelectPerson={selectPerson} />
      </header>

      <main className="main" ref={mainRef} id="explore">
        <div className="main-intro">
          <h2 className="main-intro-title">Family tree</h2>
          <p className="main-intro-lede">Select a branch, then tap any person for details.</p>
        </div>

        <AppNav
          active={appView}
          onChange={setAppView}
          counts={{
            people: data.meta.personCount ?? allPeople.length,
            stories: data.stories?.length ?? 0,
            cemetery: data.cemetery.length,
            archives: externalResources.resources.length,
            gallery: galleryCount,
            contributions: contributions.length,
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

            {appView === "gallery" && (
              <GalleryView people={allPeople} onSelectPerson={selectPerson} />
            )}

            {appView === "contribute" && (
              <ContributeView people={allPeople} onSelectPerson={selectPerson} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter
        version={data.meta.version}
        updated={data.meta.updated}
        focus={data.meta.focus}
        resourceCount={externalResources.resources.length}
      />

      <PersonDetail
        person={selected}
        cemetery={data.cemetery}
        relatives={relatives}
        stories={data.stories ?? []}
        branches={data.branches}
        heritage={data.heritage}
        onClose={closeDetail}
        onSelectRelative={selectPerson}
      />

      <style>{`
        .app { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
        .app-hero { position: relative; }
        .orbit-section {
          padding: 0 24px 56px; max-width: var(--content-max); margin: 0 auto; width: 100%;
          overflow: hidden;
        }
        .orbit-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 20px;
        }
        .orbit-title {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-top: 8px;
        }
        .orbit-dismiss {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-pill);
          border: 1px solid var(--border);
          transition: background 0.2s, color 0.2s;
        }
        .orbit-dismiss:hover {
          background: var(--bg-elevated);
          color: var(--text);
        }
        .show-orbit-btn {
          display: block; margin: 0 auto 32px;
          padding: 12px 24px; font-size: 14px; font-weight: 600;
          color: var(--accent-link);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          transition: background 0.2s;
        }
        .show-orbit-btn:hover { background: rgba(41, 151, 255, 0.1); }
        .main {
          flex: 1;
          max-width: var(--content-max);
          width: 100%;
          margin: 0 auto;
          padding: 48px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          border-top: 1px solid var(--border);
        }
        .main-intro { padding-top: 8px; }
        .main-intro-title {
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 600;
          letter-spacing: -0.03em;
        }
        .main-intro-lede {
          margin-top: 8px;
          font-size: 17px;
          color: var(--text-secondary);
        }
        .view-content { flex: 1; display: flex; flex-direction: column; gap: 20px; }
        .main-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding-top: 8px;
        }
        .main-header h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          letter-spacing: -0.03em;
        }
        .branch-desc { font-size: 17px; color: var(--text-secondary); margin-top: 6px; letter-spacing: -0.01em; }
        .view-toggle {
          display: flex; gap: 2px;
          background: var(--bg-card);
          border-radius: var(--radius-pill);
          padding: 4px;
          border: 1px solid var(--border);
        }
        .view-toggle button {
          padding: 8px 20px;
          border-radius: var(--radius-pill);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .view-toggle button.active {
          background: var(--bg-elevated);
          color: var(--text);
        }
        .main-content { flex: 1; min-height: 0; }
        .footer {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 16px 32px;
          padding: 32px 24px;
          font-size: 12px;
          color: var(--text-tertiary);
          border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .orbit-section { padding: 0 16px 40px; }
          .main { padding: 40px 16px 48px; }
          .main-header { flex-direction: column; align-items: flex-start; gap: 16px; }
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

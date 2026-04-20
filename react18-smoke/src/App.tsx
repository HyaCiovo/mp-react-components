import React, { useEffect, useRef, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  Bell,
  BibCard,
  BibFilter,
  BibjsonCard,
  BibtexButton,
  CameraContextProvider,
  CrossrefCard,
  CrystalToolkitAnimationScene,
  CrystalToolkitScene,
  DataBlock,
  DataTable,
  Download,
  DownloadButton,
  DownloadDropdown,
  Drawer,
  DrawerContextProvider,
  DrawerTrigger,
  Dropdown,
  DualRangeSlider,
  Enlargeable,
  FilterField,
  Formula,
  GlobalSearchBar,
  JsonView,
  Link,
  Markdown,
  MaterialsInput,
  Modal,
  ModalContextProvider,
  ModalTrigger,
  Navbar,
  NavbarDropdown,
  NotificationDropdown,
  OpenAccessButton,
  PeriodicContext,
  PhononAnimationScene,
  PublicationButton,
  RangeSlider,
  ReactGraphComponent,
  Scene,
  Scrollspy,
  SearchUIContainer,
  SearchUIDataHeader,
  SearchUIDataTable,
  SearchUIDataView,
  SearchUIFilters,
  SearchUIGrid,
  SearchUISearchBar,
  Select,
  SelectableTable,
  Sidebar,
  StandalonePeriodicComponent,
  Switch,
  SynthesisRecipeCard,
  TableFilter,
  Tabs,
  Tooltip
} from '@gnosys/mp-react-components';
import columns from '@mp-stories/constants/columns.json';
import filterGroups from '@mp-stories/constants/filterGroups.json';
import materialsRecords from '@mp-stories/constants/materialsRecords.json';
import { DEFAULT_OPTIONS, GRAPH } from '@mp-stories/constants';
import {
  s2 as sceneJson,
  shperes as sceneJson2
} from '@mp-src/components/crystal-toolkit/scene/simple-scene';
import { AnimationStyle, Renderer } from '@mp-src/components/crystal-toolkit/scene/constants';
import { TableLayout } from '@mp-src/components/periodic-table/periodic-table-component/periodic-table.component';

type SmokeCaseProps = {
  title: string;
  exportsUsed: string[];
  children: React.ReactNode;
};

type BoundaryState = {
  error: Error | null;
};

class CaseBoundary extends React.Component<SmokeCaseProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { title, exportsUsed, children } = this.props;
    const { error } = this.state;

    return (
      <article className={`card smoke-card ${error ? 'smoke-card-fail' : 'smoke-card-pass'}`}>
        <div className="smoke-card-header">
          <h2>{title}</h2>
          <p className="smoke-exports">{exportsUsed.join(', ')}</p>
          <span className={`smoke-badge ${error ? 'smoke-badge-fail' : 'smoke-badge-pass'}`}>
            {error ? 'FAIL' : 'PASS'}
          </span>
        </div>
        {error ? (
          <pre className="smoke-error">{error.message}</pre>
        ) : (
          <div className="smoke-body">{children}</div>
        )}
      </article>
    );
  }
}

function StatefulSelect() {
  const [value, setValue] = useState('NM');
  return (
    <Select
      value={value}
      setProps={(next: { value?: string }) => setValue(next.value || '')}
      isClearable
      options={[
        { label: 'Ferromagnetic', value: 'FM' },
        { label: 'Non-magnetic', value: 'NM' },
        { label: 'Antiferromagnetic', value: 'AFM' }
      ]}
    />
  );
}

function StatefulSwitch() {
  const [value, setValue] = useState(false);
  return (
    <Switch
      value={value}
      setProps={(next: { value?: boolean }) => setValue(!!next.value)}
      hasLabel
    />
  );
}

function SearchShell({ children }: { children: React.ReactNode }) {
  return (
    <SearchUIContainer
      disableRichColumnHeaders
      resultLabel="material"
      columns={columns as any}
      filterGroups={filterGroups as any}
      apiEndpoint="https://api.materialsproject.org/summary/"
      autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
      sortFields={['material_id']}
    >
      {children}
    </SearchUIContainer>
  );
}

function DrawerCase() {
  return (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-smoke">
        <button className="button" type="button">
          Open Drawer
        </button>
      </DrawerTrigger>
      <Drawer id="drawer-smoke">
        <div className="box">Drawer content</div>
      </Drawer>
    </DrawerContextProvider>
  );
}

function ModalCase() {
  return (
    <ModalContextProvider>
      <ModalTrigger>
        <button className="button" type="button">
          Open Modal
        </button>
      </ModalTrigger>
      <Modal>
        <div className="box">Modal content</div>
      </Modal>
    </ModalContextProvider>
  );
}

function ScrollspyCase() {
  return (
    <div className="smoke-scrollspy">
      <Scrollspy
        menuGroups={[
          {
            label: 'Table of Contents',
            items: [
              { label: 'Crystal Structure', targetId: 'section-one' },
              {
                label: 'Properties',
                targetId: 'section-two',
                items: [{ label: 'Prop One', targetId: 'section-three' }]
              }
            ]
          }
        ]}
        activeClassName="is-active"
      />
      <div className="content">
        <div id="section-one">
          <h3>Crystal Structure</h3>
        </div>
        <div id="section-two">
          <h3>Properties</h3>
        </div>
        <div id="section-three">
          <h3>Prop One</h3>
        </div>
      </div>
    </div>
  );
}

function RawSceneCase() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const scene = new (Scene as any)(
      sceneJson2,
      mountRef.current,
      {
        renderer: Renderer.WEBGL,
        extractAxis: false,
        zoomToFit2D: true
      },
      100,
      10,
      () => null
    );

    return () => {
      scene.onDestroy();
    };
  }, []);

  return <div ref={mountRef} style={{ minHeight: 220 }} />;
}

export function App() {
  const searchBarProps = {
    periodicTableMode: 'none' as any,
    placeholder: 'Search by elements, formula, or ID',
    errorMessage: 'Invalid search value',
    allowedInputTypesMap: {
      elements: { field: 'elements' },
      formula: { field: 'formula' },
      mpid: { field: 'material_ids' }
    }
  };

  const synthesisRecipe = {
    target: {
      material_formula: 'LiFePO4',
      composition: [{ elements: { Li: 1, Fe: 1, P: 1, O: 4 } }]
    },
    precursors_formula_s: ['Li2CO3', 'FePO4'],
    precursors: [
      { material_formula: 'Li2CO3', composition: [{ elements: { Li: 2, C: 1, O: 3 } }] },
      { material_formula: 'FePO4', composition: [{ elements: { Fe: 1, P: 1, O: 4 } }] }
    ],
    synthesis_type: 'solid-state',
    paragraph_string: 'Mix precursors and heat in air.',
    highlights: null,
    reaction_string: 'Li2CO3 FePO4 == LiFePO4 ; 700 C',
    operations: [
      {
        token: 'mix',
        conditions: {
          heating_temperature: [],
          heating_time: [],
          heating_atmosphere: [],
          mixing_device: 'mortar',
          mixing_media: 'ethanol'
        }
      },
      {
        token: 'heat',
        conditions: {
          heating_temperature: [{ values: [700], units: 'C' }],
          heating_time: [{ values: [2], units: 'h' }],
          heating_atmosphere: ['air'],
          mixing_device: null,
          mixing_media: null
        }
      }
    ],
    doi: '10.1038/s41467-020-15455-7'
  };

  const bibjsonEntry = {
    title: 'A React 18 compatible component library smoke test',
    author: ['Hyacinth Developer', 'Semanta Bot'],
    year: 2026,
    journal: 'Journal of Smoke Tests',
    doi: '10.1000/example-doi',
    openAccessUrl: 'https://example.com/paper.pdf'
  };

  const crossrefEntry = {
    title: ['Crossref entry title'],
    author: [{ given: 'Alice', family: 'Smith', sequence: 'first' }],
    created: { 'date-parts': [[2024]] },
    'container-title': ['Crossref Journal'],
    'short-container-title': ['CJ'],
    DOI: '10.1000/crossref-doi',
    openAccessUrl: 'https://example.com/crossref.pdf'
  };

  return (
    <main className="page">
      <div className="card">
        <h1>mp-react-components React 18 Package Smoke Test</h1>
        <p>
          Each card mounts one export or one tightly-coupled export group from the installed
          <code> @gnosys/mp-react-components </code>
          package in a React 18 host. Failures are isolated with per-case error boundaries.
        </p>
      </div>

      <section className="grid">
        <CaseBoundary title="Formula" exportsUsed={['Formula']}>
          <Formula>LiFePO4</Formula>
        </CaseBoundary>

        <CaseBoundary title="DataBlock" exportsUsed={['DataBlock']}>
          <DataBlock
            disableRichColumnHeaders
            data={{ material_id: 'mp-19395', formula_pretty: 'MnO2', volume: 143.9321176 }}
          />
        </CaseBoundary>

        <CaseBoundary title="JsonView" exportsUsed={['JsonView']}>
          <JsonView src={{ host: 'react18-smoke', mode: 'source-import' }} collapsed={1} />
        </CaseBoundary>

        <CaseBoundary title="Markdown" exportsUsed={['Markdown']}>
          {React.createElement(Markdown as any, {}, '# Hello React 18')}
        </CaseBoundary>

        <CaseBoundary
          title="Modal Suite"
          exportsUsed={['ModalContextProvider', 'ModalTrigger', 'Modal']}
        >
          <ModalCase />
        </CaseBoundary>

        <CaseBoundary
          title="Drawer Suite"
          exportsUsed={['DrawerContextProvider', 'DrawerTrigger', 'Drawer']}
        >
          <DrawerCase />
        </CaseBoundary>

        <CaseBoundary title="Tooltip" exportsUsed={['Tooltip']}>
          <>
            <button className="button" data-tip data-for="smoke-tooltip" type="button">
              Tooltip Trigger
            </button>
            <Tooltip id="smoke-tooltip">Tooltip content</Tooltip>
          </>
        </CaseBoundary>

        <CaseBoundary title="Dropdown" exportsUsed={['Dropdown']}>
          <Dropdown items={['One', 'Two', 'Three']} triggerLabel="Items" />
        </CaseBoundary>

        <CaseBoundary title="Select" exportsUsed={['Select']}>
          <StatefulSelect />
        </CaseBoundary>

        <CaseBoundary title="Switch" exportsUsed={['Switch']}>
          <StatefulSwitch />
        </CaseBoundary>

        <CaseBoundary title="RangeSlider" exportsUsed={['RangeSlider']}>
          <RangeSlider domain={[0, 100]} step={1} value={10} />
        </CaseBoundary>

        <CaseBoundary title="DualRangeSlider" exportsUsed={['DualRangeSlider']}>
          <DualRangeSlider domain={[0, 100]} step={1} value={[10, 50]} />
        </CaseBoundary>

        <CaseBoundary title="FilterField" exportsUsed={['FilterField']}>
          <FilterField id="filter-field" label="Band Gap" tooltip="A sample filter field">
            <input className="input" defaultValue="1.2" />
          </FilterField>
        </CaseBoundary>

        <CaseBoundary title="Enlargeable" exportsUsed={['Enlargeable']}>
          <Enlargeable>
            <div className="box">Expandable content</div>
          </Enlargeable>
        </CaseBoundary>

        <CaseBoundary title="DataTable" exportsUsed={['DataTable']}>
          <DataTable
            disableRichColumnHeaders
            data={materialsRecords as any}
            columns={columns as any}
            pagination
            hasHeader
            resultLabel="material"
          />
        </CaseBoundary>

        <CaseBoundary title="MaterialsInput" exportsUsed={['MaterialsInput']}>
          <MaterialsInput
            periodicTableMode={'none' as any}
            allowedInputTypes={['chemical_system', 'elements', 'formula', 'mpid'] as any}
            type={'chemical_system' as any}
            errorMessage="Please enter a valid input."
            showSubmitButton
            onSubmit={() => null}
          />
        </CaseBoundary>

        <CaseBoundary title="GlobalSearchBar" exportsUsed={['GlobalSearchBar']}>
          <GlobalSearchBar
            redirectRoute="/materials"
            placeholder="Search materials"
            hidePeriodicTable
          />
        </CaseBoundary>

        <CaseBoundary title="Navigation" exportsUsed={['Link', 'Navbar', 'Tabs']}>
          <MemoryRouter>
            <div className="content">
              <Link href="/materials">Link to materials</Link>
              <Navbar
                brandItem={{ label: 'MP React', href: '/materials' }}
                items={[
                  { label: 'Materials', href: '/materials' },
                  { label: 'Molecules', href: '/molecules' }
                ]}
              />
              <Tabs labels={['One', 'Two']}>
                <div>First tab</div>
                <div>Second tab</div>
              </Tabs>
            </div>
          </MemoryRouter>
        </CaseBoundary>

        <CaseBoundary title="NavbarDropdown" exportsUsed={['NavbarDropdown']}>
          <MemoryRouter>
            <nav className="navbar">
              <div className="navbar-menu is-active">
                <NavbarDropdown items={[{ label: 'Materials', href: '/materials' }]}>
                  More
                </NavbarDropdown>
              </div>
            </nav>
          </MemoryRouter>
        </CaseBoundary>

        <CaseBoundary title="Notifications" exportsUsed={['NotificationDropdown', 'Bell']}>
          <nav className="navbar">
            <div className="navbar-menu is-active">
              <NotificationDropdown
                notifyLevel="message"
                hasUnread
                items={[{ id: '1', header: 'Notice', content: 'React 18 smoke test notification' }]}
              />
              <Bell showBadge />
            </div>
          </nav>
        </CaseBoundary>

        <CaseBoundary title="Sidebar" exportsUsed={['Sidebar']}>
          <div className="sidebar-showcase">
            <Sidebar
              currentApp="mat-explore"
              onAppSelected={() => null}
              layout="vertical"
              width={96}
            />
          </div>
        </CaseBoundary>

        <CaseBoundary title="Scrollspy" exportsUsed={['Scrollspy']}>
          <ScrollspyCase />
        </CaseBoundary>

        <CaseBoundary
          title="Downloads"
          exportsUsed={['Download', 'DownloadButton', 'DownloadDropdown']}
        >
          <>
            <Download id="download-component" />
            <div className="buttons">
              <DownloadButton data={{ hello: 'world' }} filename="example">
                Download JSON
              </DownloadButton>
              <DownloadDropdown data={{ hello: 'world' }} filename="example">
                Export
              </DownloadDropdown>
            </div>
          </>
        </CaseBoundary>

        <CaseBoundary
          title="Publication Buttons"
          exportsUsed={['PublicationButton', 'OpenAccessButton', 'BibtexButton']}
        >
          <div className="tags">
            <PublicationButton url="https://doi.org/10.1000/example-doi">
              Journal 2024
            </PublicationButton>
            <OpenAccessButton url="https://example.com/paper.pdf" />
            <BibtexButton doi="10.1000/example-doi" />
          </div>
        </CaseBoundary>

        <CaseBoundary
          title="Bibliography Cards"
          exportsUsed={['BibCard', 'BibjsonCard', 'CrossrefCard', 'BibFilter']}
        >
          <>
            <BibCard {...bibjsonEntry} />
            <BibjsonCard bibjsonEntry={bibjsonEntry} preventOpenAccessFetch />
            <CrossrefCard crossrefEntry={crossrefEntry} preventOpenAccessFetch />
            <BibFilter bibEntries={[bibjsonEntry]} preventOpenAccessFetch />
          </>
        </CaseBoundary>

        <CaseBoundary title="SynthesisRecipeCard" exportsUsed={['SynthesisRecipeCard']}>
          <MemoryRouter>
            <SynthesisRecipeCard data={synthesisRecipe} />
          </MemoryRouter>
        </CaseBoundary>

        <CaseBoundary
          title="Periodic Basic"
          exportsUsed={['PeriodicContext', 'StandalonePeriodicComponent', 'TableFilter']}
        >
          <div className="periodic-showcase">
            <PeriodicContext>
              <StandalonePeriodicComponent
                element="Fe"
                size={56}
                enabled={false}
                disabled={false}
                hidden={false}
              />
              <TableFilter />
            </PeriodicContext>
          </div>
        </CaseBoundary>

        <CaseBoundary title="SelectableTable" exportsUsed={['SelectableTable']}>
          <div className="periodic-showcase">
            <SelectableTable
              className="max-750"
              forceTableLayout={TableLayout.MINI}
              maxElementSelectable={3}
              enabledElements={['Li', 'Fe', 'O']}
            />
          </div>
        </CaseBoundary>

        <CaseBoundary
          title="SearchUI Grid"
          exportsUsed={['SearchUIContainer', 'SearchUISearchBar', 'SearchUIGrid']}
        >
          <SearchShell>
            <SearchUISearchBar {...(searchBarProps as any)} />
            <SearchUIGrid />
          </SearchShell>
        </CaseBoundary>

        <CaseBoundary
          title="SearchUI Filters"
          exportsUsed={['SearchUIContainer', 'SearchUISearchBar', 'SearchUIFilters']}
        >
          <SearchShell>
            <SearchUISearchBar {...(searchBarProps as any)} />
            <SearchUIFilters />
          </SearchShell>
        </CaseBoundary>

        <CaseBoundary
          title="SearchUI DataHeader"
          exportsUsed={['SearchUIContainer', 'SearchUISearchBar', 'SearchUIDataHeader']}
        >
          <SearchShell>
            <SearchUISearchBar {...(searchBarProps as any)} />
            <SearchUIDataHeader />
          </SearchShell>
        </CaseBoundary>

        <CaseBoundary
          title="SearchUI DataView"
          exportsUsed={['SearchUIContainer', 'SearchUISearchBar', 'SearchUIDataView']}
        >
          <SearchShell>
            <SearchUISearchBar {...(searchBarProps as any)} />
            <SearchUIDataView />
          </SearchShell>
        </CaseBoundary>

        <CaseBoundary
          title="SearchUI DataTable"
          exportsUsed={['SearchUIContainer', 'SearchUISearchBar', 'SearchUIDataTable']}
        >
          <SearchShell>
            <SearchUISearchBar {...(searchBarProps as any)} />
            <SearchUIDataTable />
          </SearchShell>
        </CaseBoundary>

        <CaseBoundary
          title="CrystalToolkitScene"
          exportsUsed={['CameraContextProvider', 'CrystalToolkitScene']}
        >
          <CameraContextProvider>
            <CrystalToolkitScene
              debug={false}
              animation={AnimationStyle.NONE}
              inletPadding={10}
              inletSize={100}
              data={sceneJson}
              sceneSize={220}
              toggleVisibility={{}}
              settings={{
                renderer: Renderer.WEBGL,
                extractAxis: false,
                zoomToFit2D: true
              }}
            />
          </CameraContextProvider>
        </CaseBoundary>

        <CaseBoundary title="Scene" exportsUsed={['Scene']}>
          <RawSceneCase />
        </CaseBoundary>

        <CaseBoundary title="ReactGraphComponent" exportsUsed={['ReactGraphComponent']}>
          <ReactGraphComponent graph={GRAPH} options={DEFAULT_OPTIONS} />
        </CaseBoundary>

        <CaseBoundary
          title="Animation Scenes"
          exportsUsed={['CrystalToolkitAnimationScene', 'PhononAnimationScene']}
        >
          <>
            {React.createElement(CrystalToolkitAnimationScene as any, {
              data: sceneJson,
              animation: AnimationStyle.PLAY,
              sceneSize: 220
            })}
            {React.createElement(PhononAnimationScene as any, {
              data: sceneJson,
              sceneSize: 220
            })}
          </>
        </CaseBoundary>
      </section>
    </main>
  );
}

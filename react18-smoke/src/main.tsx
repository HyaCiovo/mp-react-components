import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './polyfills';
import '../../node_modules/bulma/css/bulma.min.css';
import '../../node_modules/bulma-tooltip/dist/css/bulma-tooltip.min.css';
import '../../src/styles.less';
import '../../src/stories/stories.css';
import './styles.css';
import { App } from './App';

const originalGet = axios.get.bind(axios);

axios.get = ((url: string, config?: any) => {
  if (typeof url === 'string' && url.startsWith('https://api.materialsproject.org/summary/')) {
    return Promise.resolve({
      data: {
        data: [
          {
            theoretical: false,
            material_id: 'mp-19395',
            formula_pretty: 'MnO2',
            symmetry: {
              crystal_system: 'Tetragonal',
              symbol: 'P42/mnm',
              number: 136
            },
            volume: 143.9321176,
            density: 5.026,
            nsites: 6,
            energy_above_hull: 0,
            formation_energy_per_atom: -2.31,
            is_stable: true,
            ordering: 'NM',
            total_magnetization: 0
          }
        ],
        meta: {
          total_doc: 1
        }
      }
    } as any);
  }

  if (
    typeof url === 'string' &&
    url.startsWith('https://api.materialsproject.org/materials/formula_autocomplete/')
  ) {
    return Promise.resolve({
      data: {
        data: ['LiFePO4', 'LiCoO2', 'MnO2']
      }
    } as any);
  }

  return originalGet(url, config);
}) as typeof axios.get;

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root element');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

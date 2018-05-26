import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import configStore, { initialState } from './store';

let store = configStore(initialState);

ReactDOM.render(
	<Provider {...store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
	</Provider>,
	document.getElementById('root') as HTMLElement
);
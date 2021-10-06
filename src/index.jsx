import Post from './Post';
import json from './assets/json';
import WebpackLogo from './assets/webpack-logo.png';
import React from 'react';
import { render } from 'react-dom';
import './babel';
import './styles/styles.css';
import './styles/scss.scss';

const post = new Post('Webpack Post Title');

const App = () => (
	<div class="container">
		<h1>Webpack 32</h1>

		<hr />

		<div class="logo">
		</div>

		<hr />

		<pre></pre>

		<div class="card">
			<h2>sass</h2>
		</div>
	</div>
);

render(<App />, document.getElementById('app'));

console.log('Post to string: ', post.toString());
console.log('JSON:', json);
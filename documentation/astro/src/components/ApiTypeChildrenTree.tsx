import { JSONTree } from 'react-json-tree'; // https://www.npmjs.com/package/react-json-tree
// If you're using Immutable.js: `npm i --save immutable`
import { Map } from 'immutable';

/*

// Inside a React component:
const json = {
  array: [1, 2, 3],
  bool: true,
  object: {
    foo: 'bar',
  },
  immutable: Map({ key: 'value' }),
};

<JSONTree data={json} />;
*/


























// import './ApiTypeChildrenTree.module.css';

interface ApiTypeChildrenTreeProps{
  json: any
};

export default function ApiTypeChildrenTree({ json }: ApiTypeChildrenTreeProps) {

	return (
		<>
        <JSONTree data={{renderedJSon: json}} />
		</>
	);
}


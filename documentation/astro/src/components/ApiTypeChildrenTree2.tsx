import { Tree } from 'react-arborist'; // https://www.npmjs.com/package/react-json-tree
// If you're using Immutable.js: `npm i --save immutable`


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
    <h1 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">React Arborist</h1>
    
    <a href="https://github.com/brimdata/react-arborist" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">See The React arborist repo</a>

    <hr/>
    <hr/>
    

        <Tree initialData={[json]} />
		</>
	);
}


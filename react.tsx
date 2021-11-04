interface Component {
	(props: Props): JsxElement;
}
interface JsxElement {
	tag: keyof HTMLElementTagNameMap;
	props: Props;
}
type Props = {
	children?: JsxElement[];
} & Record<string, any>;

const ReactDom = {
	render: (reactElement: JsxElement | string | number, container: HTMLElement) => {
		// Check if reactElement is string or number (leaf element with simple text as children)
		if (typeof reactElement === 'number' || typeof reactElement === 'string') {
			container.appendChild(document.createTextNode(String(reactElement)));
			return;
		}
		const domElement: HTMLElement = document.createElement(reactElement.tag);
		// fulfill element with props
		if (reactElement.props) {
			Object.keys(reactElement.props)
				.filter((p) => p !== 'children')
				.forEach((p) => (domElement[p] = reactElement.props[p]));
		}
		// recursivly render each child element in parent
		if (reactElement.props.children) {
			reactElement.props.children.forEach((child) => ReactDom.render(child, domElement));
		}
		container.appendChild(domElement);
	},
};
const React = {
	createElement: (tag, props, ...children) => {
		if (typeof tag === 'function') {
			try {
				const component: Component = tag(props);
				return component;
			} catch ({ promise, key }) {
				// Concurrent mode
				promise.then((data) => {
					promiseCache.set(key, data);
					rerender();
				});
				return { tag: 'div', props: { children: ['LOADING...'] } };
			}
		}
		const element: JsxElement = { tag, props: { ...props, children } };
		return element;
	},
};

const states = [];
let stateCursor = 0;
const useState = <S extends unknown>(initialState: S): [S, (s?: S) => void] => {
	const FROZENCURSOR = stateCursor;
	states[FROZENCURSOR] = states[FROZENCURSOR] || initialState;
	stateCursor++;

	const setState = (newState: S) => {
		states[FROZENCURSOR] = newState;
		console.log('🚀 ~ file: react.tsx ~ line 65 ~ setState ~ states', states);
		console.log('🚀 ~ file: react.tsx ~ line 57 ~ stateCursor', stateCursor);
		rerender();
	};
	return [states[FROZENCURSOR], setState];
};

const promiseCache = new Map();
const createResource = (promise, key) => {
	if (promiseCache.has(key)) {
		return promiseCache.get(key);
	}
	throw { promise: promise(), key };
};

const App: Component = () => {
	const [name, setName] = useState('persons');
	const [count, setCount] = useState(6);
	const [count2, setCount2] = useState(4);

	const dogPhotoUrl = createResource(
		() =>
			fetch('https://dog.ceo/api/breeds/image/random')
				.then((r) => r.json())
				.then((p) => p.message),
		'dogPhoto'
	);

	return (
		<div className='react-hehehe'>
			<h1>Hello, {name}</h1>
			<input
				type='text'
				value={name}
				placeholder='name'
				onchange={(e) => {
					console.log('NAME', name, e.target.value);
					setName(e.target.value);
				}}
			/>
			<h2>
				<strong>Counter:</strong> {count}
			</h2>
			<button onclick={() => setCount(count + 1)}>plus one</button>
			<button onclick={() => setCount(count - 1)}>minus one</button>
			<h2>
				<strong>Counter 2:</strong> {count2}
			</h2>
			<button onclick={() => setCount2(count2 + 1)}>plus one</button>
			<button onclick={() => setCount2(count2 - 1)}>minus one</button>
			<div>
				<img src={dogPhotoUrl} alt='Dog photo' />
			</div>
		</div>
	);
};

export const rerender = () => {
	stateCursor = 0;
	document.getElementById('root').firstChild.remove();
	ReactDom.render(<App />, document.getElementById('root'));
};

ReactDom.render(<App />, document.getElementById('root'));

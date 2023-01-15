import Test from "./components/Test";
import Providers from "./components/Providers";

function App() {
  return (
    <Providers>
      <h1 className="text-3xl font-bold underline text-red-600">
        Hello world!
      </h1>
      <Test />
      <div className="App">test</div>
    </Providers>
  );
}

export default App;

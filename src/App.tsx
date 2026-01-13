import TabsComponent from "./components/tabs-component";
import tabsData from "./data/tabs-data";

function App() {
  return (
    <main className='mx-auto flex min-h-screen w-full min-w-dvw flex-col items-center justify-center'>
      <TabsComponent tabs={tabsData} />
    </main>
  );
}

export default App;

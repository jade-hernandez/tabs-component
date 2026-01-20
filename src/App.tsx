import TabsComponent from "./components/tabs-component";
import tabsData from "./data/tabs-data";

function App() {
  return (
    <main className='mx-auto flex min-h-dvh w-full min-w-dvw flex-col items-center'>
      <TabsComponent
        tabs={tabsData}
        className='mt-50 w-75'
      />
    </main>
  );
}

export default App;

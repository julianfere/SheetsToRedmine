import { invoke } from "@tauri-apps/api";
import { SideBar } from "../../components/sidebar";
import { loadCredentials, loadOptions } from "../../utils/fileSystemOperations";

const handleClick = async () => {
  const credentials = await loadCredentials();
  const options = await loadOptions();

  const res = await invoke("test_sheet", {
    payload: { ...credentials, ...options },
  });
  console.log(res);
};

function Home() {
  // useEffect(() => {
  //   invoke("test_sheet").then((res) => {
  //     console.log(res);
  //   });
  // }, []);
  return (
    <>
      <SideBar />
      <button onClick={handleClick}>Test</button>
    </>
  );
}

export default Home;

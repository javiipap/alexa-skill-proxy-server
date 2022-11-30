import Queue from 'utils/Mutex';

export default function prueba() {
  return <div className=""></div>;
}

export async function getServerSideProps() {
  console.log(JSON.stringify(global.pendung));
  return { props: {} };
}

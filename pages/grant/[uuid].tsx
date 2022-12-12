import { GetServerSideProps } from 'next';
import connect from 'lib/mongodb';
import { generateAuthUrl } from 'lib/googleapis';

export default function GrantUuid() {
  return (
    <div className="">
      <h1>Parece que no estás registrado todavía.</h1>
      <p>Para registrarte pídele a alexa usar los servicios de google.</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const db = await connect();
    const device = await db
      .collection('devices')
      .findOne({ sessions: { uuid: query.uuid } });
    if (device === null) {
      return { props: {} };
    }
    // Redirigir a la pantalla oauth.
    return {
      props: {},
      redirect: {
        destination: generateAuthUrl(`${device.uuid}_${query.uuid as string}`),
        statusCode: 301,
      },
    };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
};

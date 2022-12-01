import { GetServerSideProps } from 'next';
import connect from 'lib/mongodb';
import { generateAuthUrl } from 'lib/googleapis';

export default function GrantMail() {
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
    const user = await db.collection('users').findOne({ mail: query.mail });
    if (user === null || user.access_token) {
      return { props: {} };
    }
  } catch (error) {
    console.error(error);
    return { props: {} };
  }

  // Redirigir a la pantalla oauth.
  return {
    props: {},
    redirect: {
      destination: generateAuthUrl(),
      statusCode: 301,
    },
  };
};

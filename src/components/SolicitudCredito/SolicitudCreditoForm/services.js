export default async function WEB_ActividadLaboral () {
	try {
	  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	  const response = await fetch(`${baseUrl}actLaboral`,
		{
		  method: 'GET',
		  cache: 'no-store',
		});
	  const data = await response.json();
	  return data;
	} catch (error) {
	  console.error("Error fetching situacion laboral:", error);
	}
  };
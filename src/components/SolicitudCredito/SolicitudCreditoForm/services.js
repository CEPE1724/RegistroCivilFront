export default async function cre_tiempo() {
  try {
    const baseUrl = process.env.REACT_APP_BASE_URL;
	console.log(`${baseUrl}/cre-tiempo/1`);
    const response = await fetch(`${baseUrl}/cre-tiempo/1`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching situacion laboral:", error);
  }
}

// export default async function cre_tiempo () {
// 	try {
// 	  const baseUrl = process.env.REACT_APP_BASE_URL;
// 	  const response = await fetch(`${baseUrl}actLaboral`,
// 		{
// 		  method: 'GET',
// 		  cache: 'no-store',
// 		});
// 	  const data = await response.json();
// 	  return data;
// 	} catch (error) {
// 	  console.error("Error fetching situacion laboral:", error);
// 	}
//   };

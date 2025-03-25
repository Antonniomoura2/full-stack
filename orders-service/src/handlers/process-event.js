exports.handler = async (event) => {
    console.log("Evento recebido:", JSON.stringify(event, null, 2));
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Evento processado com sucesso" })
    };
  };
  
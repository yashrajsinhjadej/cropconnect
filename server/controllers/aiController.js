const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the GoogleGenerativeAI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cropPredictorServices = async (soil, altitude, temperature, humidity, rainfall) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Predict crops based on the following parameters:
        Soil: ${soil},
        Altitude: ${altitude},
        Temperature: ${temperature},
        Humidity: ${humidity},
        Rainfall: ${rainfall}`;
    
    const response = await model.generateContent(prompt);
    // console.log("Full Response:", response); // Log the full response to debug

    // Extract and join the content parts
    const content = response.response.candidates[0].content.parts;
    // const content = contentParts.join(' '); // Join the parts with a space

    if (!content) {
      throw new Error("No content found in the response");
    }
    // console.log(content,'content')
    return content[0].text;
  } catch (error) {
    console.error('Error in cropPredictorServices:', error);
    throw error;
  }
};

const predictCrops = async (req, res) => {
  try {
    const { soil, altitude, temperature, humidity, rainfall } = req.query;

    if (!soil || !altitude || !temperature || !humidity || !rainfall) {
      return res.status(400).send("Missing parameters");
    }

    const altitudeNum = parseFloat(altitude);
    const temperatureNum = parseFloat(temperature);
    const humidityNum = parseFloat(humidity);
    const rainfallNum = parseFloat(rainfall);

    if (isNaN(altitudeNum) || isNaN(temperatureNum) || isNaN(humidityNum) || isNaN(rainfallNum)) {
      return res.status(400).send("Invalid parameters");
    }

    const result = await cropPredictorServices(soil, altitudeNum, temperatureNum, humidityNum, rainfallNum);
    console.log(result);
    return res.status(200).send({ message: result });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong!");
  }
};

module.exports = {
  predictCrops,
};

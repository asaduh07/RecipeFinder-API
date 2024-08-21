import  {
    FunctionDeclarationSchemaType,
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
  } from '@google-cloud/vertexai';
  
  const project = 'your-cloud-project';
  const location = 'us-central1';
  const textModel =  'gemini-1.0-pro';
  const visionModel = 'gemini-1.0-pro-vision';
  
  const vertexAI = new VertexAI({project: project, location: location});
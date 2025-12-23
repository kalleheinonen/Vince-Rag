
import { Document, RagRequest, Source } from '../types';
import { RAW_DOCUMENTS } from '../constants';

export const retrieveRelevantSources = (request: RagRequest): Source[] => {
  const { question, top_k, keywords } = request;
  
  // 1. Keyword Filtering (Metadata-based filtering)
  let filteredDocs = RAW_DOCUMENTS;
  
  keywords.forEach(kw => {
    if (kw.Key === '_partner' && kw.Value !== '_any') {
        filteredDocs = filteredDocs.filter(d => d.partner === kw.Value.replace('_', ''));
    }
    if (kw.Key === '_country' && kw.Value !== '_any') {
        filteredDocs = filteredDocs.filter(d => d.country === kw.Value.replace('_', ''));
    }
    if (kw.Key === '_city' && kw.Value !== '_any') {
        filteredDocs = filteredDocs.filter(d => d.city === kw.Value.replace('_', ''));
    }
  });

  // 2. Simple Similarity Match (Mocking Vector Search)
  // In a real app, this would call a Vector DB or Embeddings API.
  // For this standalone React app, we use a basic keyword overlap / TF-IDF mock.
  const queryTerms = question.toLowerCase().split(/\s+/).filter(t => t.length > 3);
  
  const scoredDocs = filteredDocs.map((doc, index) => {
    let score = 0;
    queryTerms.forEach(term => {
      if (doc.content.toLowerCase().includes(term)) score += 1;
      if (doc.title.toLowerCase().includes(term)) score += 2;
    });
    
    // Normalize score for simulation
    const similarity = Math.min(0.95, (score / (queryTerms.length + 1)) + 0.3 * Math.random());
    
    return {
      file: doc.title,
      page: Math.floor(Math.random() * 30) + 1, // Simulated page number
      section: "Section 1",
      similarity,
      original_indices: [index + 1],
      content: doc.content // Passing content for the synth step
    };
  });

  // Sort by similarity and return top_k
  return scoredDocs
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, top_k);
};

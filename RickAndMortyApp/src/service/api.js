// src/services/api.js (versão com fetch)

const BASE_URL = 'https://rickandmortyapi.com/api/';

export const getCharacters = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}character?page=${page}`);
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    throw error;
  }
};

export const getCharacterById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}character/${id}`);
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    throw error;
  }
};
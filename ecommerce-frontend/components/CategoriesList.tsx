import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import apiService from '../services/api.service';
import { useRouter } from 'next/router';
import { ICategory } from '@/types/category';

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    apiService.get<ICategory[]>('/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleDeleteCategory = async (id: string) => {
    try {
      await apiService.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error('Erro ao deletar categoria', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📚 Categorias
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/categories/new')}
          >
            ➕ Criar Nova Categoria
          </Button>
        </Grid>

        {categories.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Nenhuma categoria cadastrada ainda.
            </Typography>
          </Grid>
        ) : (
          categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{category.name}</Typography>
                </CardContent>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/categories/edit/${category._id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default CategoriesList;

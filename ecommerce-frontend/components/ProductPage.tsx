import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import apiService from '../services/api.service';
import { Product } from '../src/types/product.types';
import { useRouter } from 'next/router';

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    apiService.get<Product[]>('/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      await apiService.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📦 Produtos
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/products/new')}
          >
            ➕ Criar Novo Produto
          </Button>
        </Grid>

        {products.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Nenhum produto cadastrado ainda.
            </Typography>
          </Grid>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imageUrl || 'https://via.placeholder.com/150'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Preço: R$ {product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/products/edit/${product._id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
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

export default ProductPage;

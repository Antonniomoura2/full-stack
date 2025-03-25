import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import apiService from '../../../services/api.service';
import { ICategory } from '@/types/category';

const EditCategoryPage: React.FC = () => {
  const [category, setCategory] = useState<ICategory | null>(null);
  const { id } = useRouter().query;
  const router = useRouter();

  useEffect(() => {
    if (id) {
      apiService.get<ICategory>(`/categories/${id}`).then((response) => {
        setCategory(response.data);
      });
    }
  }, [id]);

  const handleUpdateCategory = async (values: { name: string }) => {
    try {
      await apiService.put(`/categories/${id}`, values);
      alert('Category updated successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Erro ao atualizar categoria', error);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {category ? `Edit ${category.name}` : 'Loading...'}
      </Typography>

      {category && (
        <Formik
          initialValues={{
            name: category.name,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateCategory}
        >
          {() => (
            <Form>
              <Box sx={{ marginTop: 4 }}>
                <Field
                  name="name"
                  as={TextField}
                  label="Category Name"
                  fullWidth
                  margin="normal"
                  error={Boolean(<ErrorMessage name="name" />)}
                  helperText={<ErrorMessage name="name" />}
                />
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }} type="submit">
                  Update Category
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginTop: 2, marginLeft: 2 }}
                    onClick={() => router.push('/categories')}
                >
                    Back to Categories
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default EditCategoryPage;

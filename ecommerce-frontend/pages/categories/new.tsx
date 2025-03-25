import React from 'react';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import apiService from '../../services/api.service';

const NewCategoryPage: React.FC = () => {
  const router = useRouter();

  const handleCreateCategory = async (values: { name: string }) => {
    try {
      await apiService.post('/categories', values);
      alert('Category created successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Erro ao criar categoria', error);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Category
      </Typography>

      <Formik
        initialValues={{
          name: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleCreateCategory}
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
                Create Category
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default NewCategoryPage;

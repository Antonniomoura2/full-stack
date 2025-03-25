import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import apiService from '../services/api.service';

type KpiData = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProductsSold: number;
  firstOrderDate: string;
  lastOrderDate: string;
  mostSoldProduct?: {
    name: string;
    price: number;
    sold: number;
  } | null;
};

export default function DashboardKPIs() {
  const [kpis, setKpis] = useState<KpiData | null>(null);

  useEffect(() => {
    apiService.get('/dashboard/report').then((response) => {
      setKpis(response?.data?.kpis);
    });
  }, []);

  if (!kpis) {
    return <CircularProgress />;
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR');

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">📦 Total de Pedidos</Typography>
              <Typography variant="h5">{kpis.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">💰 Receita Total</Typography>
              <Typography variant="h5">
                R$ {kpis.totalRevenue?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">🧾 Valor Médio</Typography>
              <Typography variant="h5">
                R$ {kpis.averageOrderValue?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">📦 Produtos Vendidos</Typography>
              <Typography variant="h5">{kpis.totalProductsSold}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">📅 Primeira Compra</Typography>
              <Typography variant="body1">
                {kpis.firstOrderDate
                  ? formatDate(kpis.firstOrderDate)
                  : '—'}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">🔁 Última Compra</Typography>
                <Typography variant="body1">
                  {kpis.lastOrderDate
                    ? formatDate(kpis.lastOrderDate)
                    : '—'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">🔥 Produto Mais Vendido</Typography>
              {kpis.mostSoldProduct ? (
                <>
                  <Typography variant="h6">{kpis.mostSoldProduct.name}</Typography>
                  <Typography color="text.secondary">
                    {kpis.mostSoldProduct.sold} vendidos • R$ {kpis.mostSoldProduct.price.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography>Nenhum produto vendido ainda.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

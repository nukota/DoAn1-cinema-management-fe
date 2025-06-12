import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useMovies } from "../../providers/MoviesProvider";
import { useProducts } from "../../providers/ProductsProvider";
import { useRevenue } from "../../providers/RevenueProvider";
import dayjs from "dayjs";

const now = dayjs();
const earliestYear = 2025;
const months: { value: string; label: string }[] = [];
for (let year = earliestYear; year <= now.year(); year++) {
  const maxMonth = year === now.year() ? now.month() + 1 : 12;
  for (let month = 1; month <= maxMonth; month++) {
    months.push({
      value: `${year}-${month.toString().padStart(2, "0")}`,
      label: `${month.toString().padStart(2, "0")}/${year
        .toString()
        .slice(-2)}`,
    });
  }
}

const AdminHome: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${now.year()}-${(now.month() + 1).toString().padStart(2, "0")}`
  );
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    ticketRevenue: 0,
    ticketCount: 0,
    productRevenue: 0,
    totalProductQuantity: 0,
    mostWatchedMovie: "",
    mostBoughtProduct: "",
  });
  const [chartStartDate, setChartStartDate] = useState<string>(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [chartEndDate, setChartEndDate] = useState<string>(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const {
    getAllRevenue,
    getMovieRevenueByDate,
    getProductRevenueByDate,
    loading: revenueLoading,
  } = useRevenue();

  // Chart state
  const [chartType, setChartType] = useState<"movie" | "product">("movie");
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);
  const { movies, fetchMoviesData } = useMovies();
  const { products, fetchProductsData } = useProducts();

  // Fetch movies/products on mount
  useEffect(() => {
    fetchMoviesData();
    fetchProductsData();
  }, []);

  // Fetch stats for cards
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [year, month] = selectedMonth.split("-");
        const startDate = dayjs(`${year}-${month}-01`).format("YYYY-MM-DD");
        const endDate = dayjs(`${year}-${month}-01`)
          .endOf("month")
          .format("YYYY-MM-DD");
        const data = await getAllRevenue({ startDate, endDate });

        // Find most watched movie and most bought product
        let mostWatchedMovie = "";
        let mostWatchedMovieCount = 0;
        if (data.movieSales) {
          for (const [title, count] of Object.entries(data.movieSales)) {
            if (typeof count === "number" && count > mostWatchedMovieCount) {
              mostWatchedMovie = title;
              mostWatchedMovieCount = count;
            }
          }
        }
        let mostBoughtProduct = "";
        let mostBoughtProductCount = 0;
        if (data.productSales) {
          for (const [name, count] of Object.entries(data.productSales)) {
            if (typeof count === "number" && count > mostBoughtProductCount) {
              mostBoughtProduct = name;
              mostBoughtProductCount = count;
            }
          }
        }

        setStats({
          totalRevenue: data?.totalRevenue || 0,
          ticketRevenue: data?.ticketRevenue || 0,
          ticketCount: data?.ticketCount || 0,
          productRevenue: data?.productRevenue || 0,
          totalProductQuantity: data?.totalProductQuantity || 0,
          mostWatchedMovie: mostWatchedMovie
            ? `${mostWatchedMovie} (${mostWatchedMovieCount})`
            : "N/A",
          mostBoughtProduct: mostBoughtProduct
            ? `${mostBoughtProduct} (${mostBoughtProductCount})`
            : "N/A",
        });
      } catch {
        setStats({
          totalRevenue: 0,
          ticketRevenue: 0,
          ticketCount: 0,
          productRevenue: 0,
          totalProductQuantity: 0,
          mostWatchedMovie: "N/A",
          mostBoughtProduct: "N/A",
        });
      }
    };
    fetchStats();
  }, [selectedMonth, getAllRevenue]);

  useEffect(() => {
    if (chartType === "movie" && movies.length > 0 && !selectedMovie) {
      setSelectedMovie(movies[0]._id);
    }
    if (chartType === "product" && products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]._id);
    }
  }, [chartType, movies, products, selectedMovie, selectedProduct]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (chartType === "movie" && selectedMovie) {
          const data = await getMovieRevenueByDate({
            startDate: chartStartDate,
            endDate: chartEndDate,
            movie_id: selectedMovie,
          });
          setChartData(data);
        } else if (chartType === "product" && selectedProduct) {
          const data = await getProductRevenueByDate({
            startDate: chartStartDate,
            endDate: chartEndDate,
            product_id: selectedProduct,
          });
          setChartData(data);
        } else {
          setChartData([]);
        }
      } catch {
        setChartData([]);
      }
    };
    fetchChartData();
  }, [
    chartType,
    selectedMovie,
    selectedProduct,
    chartStartDate,
    chartEndDate,
    getMovieRevenueByDate,
    getProductRevenueByDate,
  ]);

  return (
    <div className="home flex flex-col h-full w-full">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography
          color="black"
          sx={{
            fontSize: "40px",
            fontWeight: "medium",
          }}
        >
          Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120, alignSelf: "flex-end" }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* 1. Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              color: "#000",
              minHeight: 148,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 18,
                  width: "100%",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title="Total Revenue"
              >
                Total Revenue
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "medium",
                  mb: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={
                  revenueLoading
                    ? ""
                    : `${stats.totalRevenue.toLocaleString()} VND`
                }
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={28} />
                ) : (
                  `${stats.totalRevenue.toLocaleString()} VND`
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* 2. Movie Revenue & Ticket Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              color: "#000",
              minHeight: 148,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 18,
                  width: "100%",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title="Movie Revenue / Tickets"
              >
                Ticket sales
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "medium",
                  mb: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={
                  revenueLoading
                    ? ""
                    : `${stats.ticketRevenue.toLocaleString()} VND`
                }
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  `${stats.ticketRevenue.toLocaleString()} VND`
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#dadada",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={revenueLoading ? "" : `${stats.ticketCount} tickets`}
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  `${stats.ticketCount} tickets`
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* 3. Product Revenue & Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              color: "#000",
              minHeight: 148,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography
                sx={{
                  mb: 1,
                  fontSize: 18,
                  width: "100%",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title="Product Revenue / Sold"
              >
                Product sales
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "medium",
                  mb: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={
                  revenueLoading
                    ? ""
                    : `${stats.productRevenue.toLocaleString()} VND`
                }
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  `${stats.productRevenue.toLocaleString()} VND`
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#dadada",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={
                  revenueLoading ? "" : `${stats.totalProductQuantity} sold`
                }
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  `${stats.totalProductQuantity} sold`
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* 4. Most Watched Movie & Most Bought Product */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              color: "#000",
              minHeight: 148,
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  width: "100%",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                color="#dadada"
              >
                Most Watched
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: "medium",
                  mb: 0.5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={revenueLoading ? "" : stats.mostWatchedMovie}
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  stats.mostWatchedMovie
                )}
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  width: "100%",
                  textAlign: "start",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                color="#dadada"
              >
                Most Bought
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: "medium",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "start",
                }}
                title={revenueLoading ? "" : stats.mostBoughtProduct}
              >
                {revenueLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  stats.mostBoughtProduct
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            mb: 3,
            flexDirection: { sm: "column", md: "row" },
            gap: { sm: 0, md: 2 },
          }}
        >
          {/* Select chart type */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={chartType}
                label="Type"
                onChange={(e) => {
                  setChartType(e.target.value as "movie" | "product");
                  setChartData([]);
                  setSelectedMovie("");
                  setSelectedProduct("");
                }}
              >
                <MenuItem value="movie">Movie</MenuItem>
                <MenuItem value="product">Product</MenuItem>
              </Select>
            </FormControl>
            {/* Select movie or product */}
            {chartType === "movie" ? (
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Movie</InputLabel>
                <Select
                  value={selectedMovie}
                  label="Movie"
                  onChange={(e) => setSelectedMovie(e.target.value)}
                >
                  {movies.map((movie: any) => (
                    <MenuItem key={movie._id} value={movie._id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProduct}
                  label="Product"
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {products.map((product: any) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            {/* Select start date */}
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={chartStartDate}
              onChange={(e) => setChartStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
            {/* Select end date */}
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={chartEndDate}
              onChange={(e) => setChartEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: 400 }}>
          <LineChart
            xAxis={[
              {
                data: chartData.map((d) => new Date(d.date).getTime()),
                // label: "Date",
                valueFormatter: (value: any) => dayjs(value).format("MM/DD"),
              },
            ]}
            yAxis={[
              {
                id: "left-axis",
                label:
                  chartType === "movie" ? "Ticket Revenue" : "Product Revenue",
                valueFormatter: (value: number) =>
                  value >= 1_000_000
                    ? `${(value / 1_000_000).toFixed(1).replace(".", ",")}m`
                    : value >= 1000
                    ? `${Math.round(value / 1000)}k`
                    : value.toString(),
              },
              {
                id: "right-axis",
                label: chartType === "movie" ? "Ticket Count" : "Product Count",
                position: "right",
              },
            ]}
            series={[
              {
                data:
                  chartType === "movie"
                    ? chartData.map((d) => d.ticketRevenue)
                    : chartData.map((d) => d.productRevenue),
                label:
                  chartType === "movie" ? "Ticket Revenue" : "Product Revenue",
                color: "#1976d2",
                yAxisId: "left-axis",
              },
              {
                data:
                  chartType === "movie"
                    ? chartData.map((d) => d.ticketCount)
                    : chartData.map((d) => d.productCount),
                label: chartType === "movie" ? "Ticket Count" : "Product Count",
                color: "#fbc02d",
                yAxisId: "right-axis",
              },
            ]}
            height={400}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default AdminHome;

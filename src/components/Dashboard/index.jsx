import React, { useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import {
    Container,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Select,
    MenuItem,
    Box,
    Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const categories = ["Food", "Bills", "Salary", "Entertainment", "Other"];

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const handleEdit = (index) => {
        const transaction = transactions[index];
        setValue("title", transaction.title);
        setValue("amount", transaction.amount);
        setValue("category", transaction.category);
        setValue("date", transaction.date);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
    };



    const onSubmit = (data) => {
        if (editIndex !== null) {
            const updatedTransactions = [...transactions];
            updatedTransactions[editIndex] = data;
            setTransactions(updatedTransactions);
            setEditIndex(null);
        } else {
            setTransactions([...transactions, { ...data, amount: parseFloat(data.amount) }]);
        }
        reset();
    };


    const [filters, setFilters] = useState({
        category: "",
        startDate: "",
        endDate: "",
        search: "",
        type: ""
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesCategory =
            !filters.category || transaction.category === filters.category;
        const matchesDateRange =
            (!filters.startDate || new Date(transaction.date) >= new Date(filters.startDate)) &&
            (!filters.endDate || new Date(transaction.date) <= new Date(filters.endDate));
        const matchesSearch =
            !filters.search || transaction.title.toLowerCase().includes(filters.search.toLowerCase());
        return matchesCategory && matchesDateRange && matchesSearch;
    });

    React.useEffect(() => {
        const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
        if (storedTransactions) {
            setTransactions(storedTransactions);
        }
    }, []);

    const calculateTotals = () => {
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach((transaction) => {
            if (transaction.category === "Salary") {
                totalIncome += transaction.amount;
            } else {
                totalExpenses += transaction.amount;
            }
        });

        return {
            totalBalance: totalIncome - totalExpenses,
            totalIncome,
            totalExpenses,
        };
    };

    const totals = calculateTotals();

    React.useEffect(() => {
        if (transactions.length > 0) {
            localStorage.setItem("transactions", JSON.stringify(transactions));
        }
    }, [transactions]);

    return (
        <Container maxWidth="md" style={{ padding: "16px" }}>
            <Typography variant="h4" gutterBottom align="center">
                Transaction Management
            </Typography>
            <Grid container spacing={2} style={{ marginTop: "24px", marginTop: "24px" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h5" gutterBottom style={{ marginTop: "24px" }}>
                        Transaction Summary
                    </Typography>
                    <Box style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px", marginTop: '10px' }}>
                        <Typography variant="h6">
                            <strong>Total Balance:</strong> ${totals.totalBalance.toFixed(2)}
                        </Typography>
                        <Typography variant="h6" style={{ color: "green" }}>
                            <strong>Total Income:</strong> ${totals.totalIncome.toFixed(2)}
                        </Typography>
                        <Typography variant="h6" style={{ color: "red" }}>
                            <strong>Total Expenses:</strong> ${totals.totalExpenses.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>  <Typography variant="h5" gutterBottom style={{ marginTop: "24px" }}>
                        Breakdown by Category
                    </Typography>
                        <Box style={{ height: "300px" }}>
                            <Pie
                                data={{
                                    labels: categories,
                                    datasets: [
                                        {
                                            data: categories.map((category) =>
                                                transactions
                                                    .filter((t) => t.category === category)
                                                    .reduce((sum, t) => sum + t.amount, 0)
                                            ),
                                            backgroundColor: [
                                                "#FF6384",
                                                "#36A2EB",
                                                "#FFCE56",
                                                "#4BC0C0",
                                                "#9966FF",
                                            ],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: "top",
                                        },
                                    },
                                }}
                            />
                        </Box></Box>
                </Grid>
            </Grid>



            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Title"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="amount"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "Amount is required",
                        validate: (value) =>
                            parseFloat(value) > 0 || "Amount must be greater than 0",
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Amount"
                            type="number"
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            displayEmpty
                            error={!!errors.category}
                            fullWidth
                        >
                            <MenuItem value="" disabled>
                                Select Category
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.category && (
                    <Typography color="error">{errors.category.message}</Typography>
                )}
                <Controller
                    name="date"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.date}
                            helperText={errors.date?.message}
                            fullWidth
                        />
                    )}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                >
                    {editIndex !== null ? "Update Transaction" : "Add Transaction"}
                </Button>
            </form>
            <Typography variant="h6" gutterBottom>
                Filters
            </Typography>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    name="startDate"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    name="endDate"
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    name="search"
                    label="Search by Title"
                    value={filters.search}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
            </div>
            <Box>
                <Button variant="contained"
                    sx={{ padding: "10px 20px", marginBottom: "16px" }}
                    color="primary" onClick={() => {
                        setFilters({
                            category: "",
                            startDate: "",
                            endDate: "",
                            search: "",
                            type: ""
                        });
                    }}>Rest filter</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransactions
                            .filter((transaction) => {
                                if (filters.type === "income") {
                                    return transaction.category === "Salary";
                                }
                                if (filters.type === "expense") {
                                    return transaction.category !== "Salary";
                                }
                                return true;
                            })
                            .map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{transaction.title}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>{transaction.category}</TableCell>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEdit(index)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>
    );
};

export default Dashboard;
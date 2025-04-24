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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";


const categories = ["Food", "Bills", "Salary", "Entertainment", "Other"];

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

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


    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Transaction Management
            </Typography>
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
                >
                    {editIndex !== null ? "Update Transaction" : "Add Transaction"}
                </Button>
            </form>
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
                        {transactions.map((transaction, index) => (
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
                                        color="secondary"
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
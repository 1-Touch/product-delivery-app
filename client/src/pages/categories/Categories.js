import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";

// Components
import PageTitle from "../../components/PageTitle/PageTitle";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";

// Base URL
import { config } from "../../config";

export default function Categories() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "Name",
      field: "name",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const { baseUrl } = config;
  const token = localStorage.getItem("jwt_token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/categories`);
      const data = response.data.map(category => {
        return {
          id: category._id,
          name: category.name,
        };
      });
      setCategories(data);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onAdd = async (data, resolve) => {
    try {
      const res = await axios.post(
        `${baseUrl}/category/create/${userId}`,
        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      setCategories([
        ...categories,
        { id: res.data.data._id, name: res.data.data.name },
      ]);
      resolve();
    } catch (err) {
      console.log(err);
      resolve();
    }
  };

  const onUpdate = async (data, resolve) => {
    const updatedData = { name: data.name };
    try {
      const res = await axios.put(
        `${baseUrl}/category/${data.id}/${userId}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      const oldCategories = categories.filter(category => category.id !== res.data._id);
      const newCategories = [...oldCategories, { id: res.data._id, name: res.data.name }];
      setCategories(newCategories);
    } catch (err) {
      console.log(err);
    }
    resolve();
  };

  const onDelete = async (data, resolve) => {
    try {
      await axios.delete(`${baseUrl}/category/${data.id}/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setCategories(prevState =>
        prevState.filter(category => category.id !== data.id),
      );
      resolve();
    } catch (err) {
      console.log(err);
      resolve();
    }
  };

  return (
    <>
      <PageTitle title="Categories" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {loading ? (
            <Loading />
          ) : (
            <Table
              title="Category List"
              columns={columns}
              data={categories}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

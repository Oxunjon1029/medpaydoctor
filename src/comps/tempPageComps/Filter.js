import React, { useEffect, useState } from "react";
import { Button, Select } from "antd";
import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { getCategory, getSubCategory } from "../../server/Template/config/category";
import { filterTempObj } from "../../server/Template/config/tempObj";
import { filterTemp } from "../../server/Template/config/template";
import { useDispatch } from "react-redux";
import { setPageData } from "../../redux/actions";

const { Option } = Select;

const Filter = ({ temptype }) => {
	const [category, setCategory] = useState([]);
	const [subcategory, setSubCategory] = useState([]);
	const [subCategoryId, setSubCategoryId] = useState("");
	const dispatch = useDispatch();

	const subcatChange = (id) => {
		setSubCategoryId(id);
	};

	const categoryChange = (catId) => {
		getSubCategory(catId).then(({ data }) => {
			if (data) setSubCategory(data.content);
		});
	};

	const filterBtn = () => {
		if (temptype === "object") {
			filterTempObj(subCategoryId).then(({ data }) => {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			});
		} else {
			filterTemp(subCategoryId).then(({ data }) => {
				dispatch(setPageData({ content: data.content, total: data.totalElements }));
			});
		}
	};

	useEffect(() => {
		getCategory().then(({ data }) => {
			if (data) setCategory(data.content);
		});
	}, []);

	return (
		<div className="temp_cont_head">
			<Select onChange={categoryChange} style={{ minWidth: "200px" }}>
				{category.map((item) => (
					<Option value={item.categoryId} key={item.categoryId}>
						{item.name}
					</Option>
				))}
			</Select>
			<ArrowRightOutlined />
			<Select onChange={subcatChange} style={{ minWidth: "200px" }}>
				{subcategory.map((item) => (
					<Option value={item.subCategoryId} key={item.subCategoryId}>
						{item.name}
					</Option>
				))}
			</Select>
			<ArrowRightOutlined />
			<Button onClick={filterBtn} icon={<SearchOutlined />} className="temp_cat_btn">
				Поиск...
			</Button>
		</div>
	);
};

export default Filter;

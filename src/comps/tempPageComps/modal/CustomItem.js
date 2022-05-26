import React, { useEffect, useState } from "react";
import { Form, Input, Select, Row, Col } from "antd";
import { getCategory, getSubCategory } from "../../../server/Template/config/category";

const { Option } = Select;

const CustomItem = () => {
	const [category, setCategory] = useState([]);
	const [subcategory, setSubCategory] = useState([]);

	useEffect(() => {
		getCategory().then(({ data }) => {
			if (data) setCategory(data.content);
		});
	}, []);

	const categoryChange = catId => {
		if (catId)
			getSubCategory(catId).then(({ data }) => {
				if (data) setSubCategory(data.content);
			});
	};

	return (
		<React.Fragment>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col className="gutter-row" span={12}>
					<Form.Item key="Category" label="Category" rules={[{ required: true, message: "Please select Category!" }]}>
						<Select allowClear placeholder="select Category" onChange={categoryChange}>
							{category.map((item, index) => (
								<Option value={item.categoryId} key={index}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col className="gutter-row" span={12}>
					<Form.Item
						key="subCategoryId"
						label="Sub-Category"
						name="subCategoryId"
						rules={[{ required: true, message: "Please select sub-Category!" }]}>
						<Select allowClear placeholder="select subCategory">
							{subcategory.map((item, i) => (
								<Option value={item.subCategoryId} key={i}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Form.Item
				name="title"
				label={`Sarlavha`}
				rules={[{ required: true, message: "Please input the title!" }]}
				key="custom_title">
				<Input />
			</Form.Item>
			<Form.Item name="description" label={`Tavsifi`} key="tavsifi_custom">
				<Input />
			</Form.Item>
		</React.Fragment>
	);
};

export default CustomItem;

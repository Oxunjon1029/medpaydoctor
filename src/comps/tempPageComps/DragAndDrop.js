import { Button, Card, Layout, Pagination, Radio, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, PlusOutlined, ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
// import { setCkEditor, setInsideModal } from "../../redux/actions";
import { filterTempObj, getTempObj, getTempObjSave } from "../../server/Template/config/tempObj";
import { getCategory, getSubCategory } from "../../server/Template/config/category";

const { Header, Content } = Layout;
const { Option } = Select;

const DragAndDrop = React.memo(({ MCData, setMCData, insideForm }) => {
	const useindex = useRef(0);
	const [draggable, setDraggable] = useState([]);
	const [total, setTotal] = useState(1);
	const [radioValue, setRadioValue] = useState("standart");
	const [category, setCategory] = useState([]);
	const [subcategory, setSubCategory] = useState([]);
	const [subCategoryId, setSubCategoryId] = useState("");

	useEffect(() => {
		getTempObj().then(({ data }) => {
			setDraggable(data.content);
			setTotal(data.totalElements);
		});
		getCategory().then(({ data }) => {
			if (data) setCategory(data.content);
		});
	}, []);

	const radioChange = (e, page = 1, size = 10) => {
		const {
			target: { value },
		} = e;
		setRadioValue(value);
		if (value === "standart") {
			getTempObj(page, size).then(({ data }) => {
				setDraggable(data.content);
				setTotal(data.totalElements);
			});
		}
		if (value === "saved") {
			getTempObjSave(page, size).then(({ data }) => {
				setDraggable(data.content);
				setTotal(data.totalElements);
			});
		}
	};

	const dragStart = (ev, el) => {
		ev.target.classList.add("dragging");
		let data = JSON.stringify(el);
		ev.dataTransfer.setData("dropable", data);
		ev.dataTransfer.setData("isOrder", "false");
	};

	const onDrop = ev => {
		let el = JSON.parse(ev.dataTransfer.getData("dropable"));
		let isOrder = ev.dataTransfer.getData("isOrder");
		if (isOrder === "true") {
			let index = +ev.dataTransfer.getData("index");
			let newList = [...MCData];
			newList.splice(index, 1);
			newList.splice(useindex.current, 0, el);
			setMCData(newList);
		} else {
			let includes = MCData.filter(item => item.id === el.id);
			if (includes.length === 0) {
				let newList = [...MCData];
				newList.splice(useindex.current, 0, el);
				setMCData(newList);
			}
		}
	};

	// const toogleopen = (id, index) => {
	// 	dispatch(
	// 		setInsideModal({
	// 			title: "просмотр объект",
	// 			visible: true,
	// 			action: "createObj",
	// 			id,
	// 			isreturn: true,
	// 			index,
	// 		})
	// 	);
	// 	getTOeditData(id).then(({ data }) => {
	// 		insideForm.setFieldsValue({ title: data.title, description: data.description });
	// 		dispatch(setCkEditor(data.context));
	// 	});
	// };

	const delcard = index => {
		let newList = [...MCData];
		newList.splice(index, 1);
		setMCData(newList);
	};

	const addDrop = (ev, el) => {
		let btn = ev.target.closest("button");
		btn.classList.add("added");
		let includes = MCData.filter(item => item.id === el.id);
		if (includes.length === 0) {
			setMCData(prev => [...prev, el]);
		}
	};

	const dsOrder = (ev, el, index) => {
		ev.target.classList.add("dragging");
		let data = JSON.stringify(el);
		ev.dataTransfer.setData("dropable", data);
		ev.dataTransfer.setData("isOrder", "true");
		ev.dataTransfer.setData("index", index);
	};
	const onDragend = ev => {
		ev.target.classList.remove("dragging");
	};

	const dragover = ev => {
		ev.preventDefault();
		let element = ev.target.closest("#orderCard");
		if (element) {
			let index = element.getAttribute("index");
			useindex.current = index;
		}
	};

	const modalPageChange = (page, size) => {
		radioChange(radioValue, page, size);
	};

	// filter

	const subcatChange = id => {
		setSubCategoryId(id);
	};

	const categoryChange = catId => {
		getSubCategory(catId).then(({ data }) => {
			if (data) setSubCategory(data.content);
		});
	};

	const filterBtn = () => {
		filterTempObj(subCategoryId).then(({ data }) => {
			setDraggable(data.content);
			setTotal(data.totalElements);
		});
	};

	// filter

	return (
		<Layout key="drag_layout">
			<Header className="temp_modal_head">
				<div className="temp_dragdrop_head">
					<Select onChange={categoryChange} style={{ maxWidth: "250px" }}>
						{category.map(item => (
							<Option value={item.categoryId} key={item.categoryId}>
								{item.name}
							</Option>
						))}
					</Select>
					<ArrowRightOutlined />
					<Select onChange={subcatChange} style={{ maxWidth: "250px" }}>
						{subcategory.map(item => (
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
				<Radio.Group buttonStyle="solid" defaultValue="standart" onChange={radioChange}>
					<Radio.Button value="standart">Стандарт</Radio.Button>
					<Radio.Button value="saved">Сохранено</Radio.Button>
				</Radio.Group>
			</Header>
			<Content className="temp_modal_cont_box">
				<div className="temp_modal_cont" onDrop={e => onDrop(e)} onDragOver={dragover}>
					{MCData.map((el, index) => (
						<Card
							index={index}
							id="orderCard"
							onDragEnd={ondragend}
							onDragStart={ev => dsOrder(ev, el, index)}
							draggable={true}
							key={index}
							title={
								<div className="temp_mod_card_head">
									<span className="temp_mod_card_tit">{el.title}</span>
									<Button
										onClick={() => delcard(index)}
										icon={<DeleteOutlined />}
										shape="circle"
										danger
										key="delcard_btn"
									/>
								</div>
							}
							className="temp_card"
							hoverable>
							{el.description}
						</Card>
					))}
				</div>
				<div className="temp_modal_side_box">
					<div className="temp_mod_side_top">
						{draggable.map((el, index) => (
							<Card
								onDragEnd={onDragend}
								onDragStart={e => dragStart(e, el)}
								draggable={true}
								key={index}
								title={
									<div className="temp_side_card_head">
										<span className="temp_side_card_tit">{el.title}</span>
										<Button
											id="fullTemplate_btn"
											className="addbtn"
											onClick={ev => addDrop(ev, el)}
											icon={<PlusOutlined />}
											type="primary"
											size="small">
											добавить
										</Button>
									</div>
								}
								className="temp_side_card "
								hoverable>
								{el.description}
							</Card>
						))}
					</div>
					<div className="temp_mod_foot">
						<Pagination onChange={modalPageChange} size="small" total={total} />
					</div>
				</div>
			</Content>
		</Layout>
	);
});

export default DragAndDrop;

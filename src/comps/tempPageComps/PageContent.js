import { Button, Card, Space, Modal } from "antd";
import React, { useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setCkEditor, setDefModal, setInsideModal } from "../../redux/actions";
import { getTOeditData } from "../../server/Template/config/tempObj";
import { deleteTemp, deleteTempObj, readTemp, readTempObj } from "../../server/Template/actionCreator";
import { getTempeditData, getTempFormData } from "../../server/Template/config/template";

const PageContent = React.memo(({ type, temptype, defForm, insideForm, setMCData }) => {
	const { pageData } = useSelector(state => state.data);
	const dispatch = useDispatch();

	useEffect(() => {
		readTempObj(dispatch);
	}, [dispatch]);

	const viewGet = id => {
		getTOeditData(id).then(({ data }) => {
			insideForm.setFieldsValue({ title: data.title, description: data.description });
			dispatch(setCkEditor(data.context ?? "<p></p>"));
		});
	};

	const editGet = id => {
		getTempFormData(id).then(({ data }) => {
			defForm.setFieldsValue({ title: data.title, description: data.description });
		});
		getTempeditData(id).then(({ data }) => {
			setMCData(data);
		});
	};

	const viewBtn = id => {
		if (temptype === "object") {
			dispatch(
				setInsideModal({
					title: "просмотр объектa",
					visible: true,
					action: "createObj",
					id,
					isreturn: false,
					index: null,
				})
			);
			viewGet(id);
			readTempObj(dispatch);
		} else {
			dispatch(setDefModal({ title: "просмотр шаблона", visible: true, action: "createTemp", id }));
			editGet(id);
			readTemp(dispatch);
		}
	};

	const editBtn = id => {
		if (temptype === "object") {
			dispatch(
				setInsideModal({
					title: "изменить объектa",
					visible: true,
					action: "updateObj",
					id,
					isreturn: false,
					index: null,
				})
			);
			viewGet(id);
		} else {
			dispatch(setDefModal({ title: "изменить шаблона", visible: true, action: "updateTemp", id }));
			editGet(id);
		}
	};

	const deleteBtn = id => {
		Modal.confirm({
			content: "Rostan o'chirishni xohlaysizmi ?",
			okText: "Ha",
			cancelText: "Yo'q",
			onOk: () => {
				if (temptype === "object") {
					deleteTempObj(dispatch, id);
				} else {
					deleteTemp(dispatch, id);
				}
			},
		});
	};

	const titleBtn = id => {
		return type === "standart" ? (
			<Button onClick={() => viewBtn(id)} type="primary">
				просмотр
			</Button>
		) : (
			<Space>
				<Button onClick={() => editBtn(id)} icon={<EditOutlined />} shape="circle" />
				<Button onClick={() => deleteBtn(id)} icon={<DeleteOutlined />} shape="circle" danger />
			</Space>
		);
	};

	return (
		<div className="temp_content">
			{pageData.content.map((item, index) => (
				<Card
					key={index}
					title={
						<div className="temp_maincont_card_head">
							<span className="temp_maincont_card_tit">{item.title}</span>
							<div>{titleBtn(temptype === "object" ? item.id : item.templateId)}</div>
						</div>
					}
					className="temp_card"
					hoverable>
					{item.description}
				</Card>
			))}
		</div>
	);
});

export default PageContent;

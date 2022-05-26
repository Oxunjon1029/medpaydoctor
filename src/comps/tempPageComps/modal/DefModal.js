import React from "react";
import { Modal, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeDefModal } from "../../../redux/actions";
import DragAndDrop from "../DragAndDrop";
import CustomItem from "./CustomItem";
import { createTemp, updateTemp } from "../../../server/Template/actionCreator";

const bodyStyle = {
	height: "100%",
};

const DefModal = React.memo(({ defForm, MCData, setMCData, insideForm }) => {
	const dispatch = useDispatch();
	const { visible, title, action, id } = useSelector(state => state.modal.defaultM);

	const OnSAVE = () => {
		defForm
			.validateFields()
			.then(val => {
				if (action === "createTemp") createTemp(dispatch, val, MCData);
				if (action === "updateTemp") updateTemp(dispatch, { ...val, templateId: id }, MCData);
			})
			.then(() => {
				onCancel();
				message.success("Saqlandi", [0.6]);
			})
			.catch(() => {
				message.error("Qandaydir xatolik yuz berdi", [0.5]);
			});
	};

	const onCancel = () => {
		document.querySelectorAll("#fullTemplate_btn").forEach(el => {
			el.classList.remove("added");
		});
		dispatch(closeDefModal());
		defForm.resetFields();
		if (MCData.length) setMCData([]);
	};

	return (
		<Modal
			centered
			width={"95%"}
			bodyStyle={bodyStyle}
			visible={visible}
			title={title}
			okText={"Сохранить"}
			cancelText={"Отмена"}
			onCancel={onCancel}
			onOk={OnSAVE}>
			<Form form={defForm} layout="vertical" name="form_in_modal_DEFAULT">
				<CustomItem />
				<Form.Item label="" key="def_form_item">
					<DragAndDrop insideForm={insideForm} MCData={MCData} setMCData={setMCData} />
				</Form.Item>
			</Form>
		</Modal>
	);
});

export default DefModal;

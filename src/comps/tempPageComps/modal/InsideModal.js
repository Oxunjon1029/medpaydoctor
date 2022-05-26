import React from "react";
import { Modal, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { closeInsideModal, setCkEditor } from "../../../redux/actions";
import { createObj, updateTempObj } from "../../../server/Template/actionCreator";
import CustomItem from "./CustomItem";

const bodyStyle = {
	height: "100%",
};

const InsideModal = React.memo(({ insideForm, MCData, setMCData }) => {
	const {
		modal: {
			InsideM: { visible, title, action, id, isreturn, index },
		},
		data: { ckEditor = "<p></p>" },
	} = useSelector(state => state);
	const dispatch = useDispatch();

	const OnSAVE = () => {
		insideForm
			.validateFields()
			.then(val => {
				console.log(val);
				if (action === "createObj") {
					if (isreturn) {
						createObj(dispatch, val, false).then(res => {
							if (res) {
								let newList = [...MCData];
								newList.splice(index, 1, res);
								setMCData(newList);
							}
						});
					} else createObj(dispatch, val);
				} else if (action === "updateObj") updateTempObj(dispatch, { ...val, id });
			})
			.then(() => {
				onCancel();
				message.success("Saqlandi", [0.6]);
			})
			.catch(() => {
				message.error("xato bor", [0.5]);
			});
	};

	const onCancel = () => {
		dispatch(closeInsideModal());
		insideForm.resetFields();
		if (ckEditor !== "<p></p>") dispatch(setCkEditor("<p></p>"));
	};

	return (
		<Modal
			centered
			bodyStyle={bodyStyle}
			width="95%"
			title={title}
			visible={visible}
			onCancel={onCancel}
			onOk={OnSAVE}
			okText={"Сохранить"}
			cancelText={"Отмена"}
			className="template-modal">
			<Form form={insideForm} layout="vertical" name="form_in_modal_INSIDE">
				<CustomItem />
				<Form.Item
					noStyle
					key="context"
					name="context"
					label="Malumotlar"
					getValueFromEvent={(_, editor) => editor.getData()}>
					<CKEditor data={ckEditor} editor={ClassicEditor} />
				</Form.Item>
			</Form>
		</Modal>
	);
});

export default InsideModal;

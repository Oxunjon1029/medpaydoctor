import React, { useState } from "react";
import { Radio, Button, Layout, Space, Pagination, Popover, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageContent from "../comps/tempPageComps/PageContent";
import DefModal from "../comps/tempPageComps/modal/DefModal";
import { useDispatch, useSelector } from "react-redux";
import { setDefModal, setInsideModal } from "../redux/actions";
import InsideModal from "../comps/tempPageComps/modal/InsideModal";
import { readTemp, readTempObj, readTempObjSave, readTempSave } from "../server/Template/actionCreator";
import Filter from "../comps/tempPageComps/Filter";

const { Header, Content, Footer } = Layout;

const TemplatesP = () => {
	const dispatch = useDispatch();
	const [type, setType] = useState("standart");
	const [temptype, setTempType] = useState("object");
	const [defForm] = Form.useForm();
	const [insideForm] = Form.useForm();
	const [MCData, setMCData] = useState([]);
	const { total = 1 } = useSelector(state => state.data.pageData);

	const typeChange = e => {
		const {
			target: { value },
		} = e;
		setType(value);
		if (value === "standart" && temptype === "object") {
			readTempObj(dispatch);
		} else if (value === "standart" && temptype === "template") {
			readTemp(dispatch);
		} else if (value === "saved" && temptype === "object") {
			readTempObjSave(dispatch);
		} else {
			readTempSave(dispatch);
		}
	};

	const tempTypeChange = e => {
		const {
			target: { value },
		} = e;
		setTempType(value);
		if (type === "standart" && value === "object") {
			readTempObj(dispatch);
		} else if (type === "standart" && value === "template") {
			readTemp(dispatch);
		} else if (type === "saved" && value === "object") {
			readTempObjSave(dispatch);
		} else {
			readTempSave(dispatch);
		}
	};

	const tempCreateBtn = () => {
		dispatch(
			setDefModal({
				title: "Создание шаблона",
				visible: true,
				action: "createTemp",
			})
		);
	};

	const ObjCreateBtn = () => {
		dispatch(
			setInsideModal({
				title: "Создание объектa",
				visible: true,
				action: "createObj",
				isreturn: false,
				index: null,
			})
		);
	};

	const pageChange = (page, size) => {
		if (type === "standart" && temptype === "object") {
			readTempObj(dispatch, page, size);
		} else if (type === "standart" && temptype === "template") {
			readTemp(dispatch, page, size);
		} else if (type === "saved" && temptype === "object") {
			readTempObjSave(dispatch, page, size);
		} else {
			readTempSave(dispatch, page, size);
		}
	};

	const popCont = (
		<Space>
			<Button key="tempCreateBtn" onClick={tempCreateBtn}>
				Полные шаблоны
			</Button>
			<Button key="ObjCreateBtn" onClick={ObjCreateBtn}>
				Шаблоны
			</Button>
		</Space>
	);

	return (
		<Layout key="template_layout" className="temp_layut">
			<Header className="temp_head">
				<Space>
					<Radio.Group buttonStyle="solid" value={type} onChange={typeChange}>
						<Radio.Button key="standart" value="standart">
							Стандарты
						</Radio.Button>
						<Radio.Button key="saved" value="saved">
							Сохраненные
						</Radio.Button>
					</Radio.Group>
				</Space>
				<Space>
					<Radio.Group buttonStyle="solid" value={temptype} onChange={tempTypeChange}>
						<Radio.Button key="object" value="object">
							Шаблоны
						</Radio.Button>
						<Radio.Button key="template" value="template">
							Полные шаблоны
						</Radio.Button>
					</Radio.Group>
				</Space>
			</Header>
			<Layout>
				<Content>
					<DefModal insideForm={insideForm} setMCData={setMCData} MCData={MCData} defForm={defForm} />
					<InsideModal MCData={MCData} setMCData={setMCData} insideForm={insideForm} />
					<Filter temptype={temptype} />
					<PageContent
						setMCData={setMCData}
						defForm={defForm}
						type={type}
						temptype={temptype}
						insideForm={insideForm}
					/>
				</Content>
			</Layout>
			<Footer key="footer" className="temp_foot">
				<Popover content={popCont} title="Создать новый">
					<Button key="temp_addbtn" className="temp_addbtn" icon={<PlusOutlined />} shape="round">
						Создат
					</Button>
				</Popover>
				<Pagination
					pageSize={9}
					hideOnSinglePage={true}
					onChange={pageChange}
					size="small"
					total={total}
					key="temp_pagination"
				/>
			</Footer>
		</Layout>
	);
};

export default TemplatesP;

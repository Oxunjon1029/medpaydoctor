import React, { useEffect, useState } from "react";
import { Table, Skeleton, Button, Modal, Space, Tabs, Radio, Tag, Card, Form, Input, Upload, message } from "antd";
import { TiArrowBackOutline } from "react-icons/ti";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
	OrderGet,
	orderPatientServe,
	orderMedCardCreate,
	orderFileUpload,
	getUploadFile,
	deleteUploadFile,
} from "../server/config/order";
import UserMedForm from "../comps/UserMedForm";
import { FileAddOutlined, DownloadOutlined } from "@ant-design/icons";
import { getTemp, getTempeditData, getTempSave } from "../server/Template/config/template";
import "../style/booking.css";
import MedCardFilter from "../comps/medCardFilter";
import { GetAllUserMedCardEnabled, GetMedCardById, UnFinishedDeleteGet } from "../server/config/treated";
import ModalOldOnes from "../comps/ModalOldOnes";

const { Search } = Input;
const { TabPane } = Tabs;
const layout = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const BookingsP = () => {
	const [loading, setLoading] = useState(true);
	const [bookingloading, setBookingLoading] = useState(true);
	const [useMedForm] = Form.useForm();
	const [orderObjForm] = Form.useForm();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const [listColumns, setListColumns] = useState([]);
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState(false);
	const [index, setIndex] = useState(0);
	const [isdisabled, setisdisabled] = useState(true);
	const [temps, setTemps] = useState([]);
	const [objects, setObjects] = useState([]);
	const [userServisId, setUserServisId] = useState({});
	const [filesId, setFilesId] = useState([]);
	const [isShow, setIsShow] = useState(false);
	const [showOldMedCars, setshowOldMedCars] = useState(false);
	const [byIdOldOnes, setByIdOldOnes] = useState([]);
	const [usedMedCards, setUsedMedCards] = useState([]);
	const [fileUrls, setfileUrls] = useState([]);

	const oldtreatedcolumns = [
		{
			title: "Bemor",
			dataIndex: "userFullName",
			key: "userFullName",
		},
		{
			title: "Xizmat nomi",
			dataIndex: "serviceItemName",
			key: "serviceItemName",
		},
		{
			key: "madCardId",
			title: "Ma'lumotlar",
			dataIndex: "madCardId",
			render: (madCardId, obj) => (
				<Button key={madCardId} onClick={() => batafsilBtn(madCardId, obj)}>
					Batafsil
				</Button>
			),
		},
	];

	const studentColumns = [
		{
			title: "Bemor",
			key: "patientName",
			dataIndex: "patientName",
		},
		{
			title: "Xizmat nomi",
			key: "serviceItemName",
			dataIndex: "serviceItemName",
		},
		{
			title: "Vaqti",
			key: "time",
			dataIndex: "time",
			render: time => <span style={{ display: "flex" }}>{time ? Object.keys(time)[0] : null}</span>,
		},
		{
			title: "Sanasi",
			key: "date",
			dataIndex: "date",
		},
		{
			title: "MedKarta",
			key: "orderId",
			dataIndex: "orderId",
			render: (id, object) => (
				<Button disabled={object.status === "ORDERED"} onClick={() => medcardBtn(id, object)}>
					To'ldirish
				</Button>
			),
		},
	];

	const batafsilBtn = (id, obj) => {
		setIsShow(true);
		setfileUrls(obj.fileUrls);
		GetMedCardById(id).then(res => {
			setByIdOldOnes(res.data.cardContext);
		});
	};

	const oldOnCancel = () => {
		setIsShow(false);
	};

	const handlePaginationChange = page => {
		setCurrentPage(page);
	};

	const medcardBtn = (id, object) => {
		showModal();
		setUserServisId({ ...object });
		orderPatientServe(id).then(res => {
			setUserServisId({ ...object, orderHistoryId: res.data });
		});
	};

	const GetOrders = () => {
		OrderGet().then(res => {
			setListColumns(res.data.content);
			setTotalElements(res.data.totalElements);
			setBookingLoading(false);
		});
	};

	const StandartTemps = (page, size) => {
		getTemp(page, size).then(({ data }) => {
			setTemps(data.content);
		});
	};

	const SavedTemps = (page, size) => {
		getTempSave(page, size).then(({ data }) => {
			setTemps(data.content);
		});
	};

	useEffect(() => {
		GetOrders();
		StandartTemps();
		setLoading(false);
	}, [setLoading]);

	const showModal = () => {
		setVisible(true);
	};

	const handleTabChange = key => {
		if (key === "1") {
			StandartTemps();
		} else {
			SavedTemps();
		}
	};

	const next = () => {
		if (selected) {
			orderObjForm
				.validateFields()
				.then(newvalues => {
					orderMedCardCreate(objects, newvalues, userServisId, filesId, temps[index]);
				})
				.then(() => {
					message.success("Muvaffaqiyatli saqlandi!!!", [0.6]);
				})
				.catch(() => {
					message.error("Qandaysdir xato yuzaga keldi.Qayta urinib ko'ring!!!", [0.6]);
				});
			setVisible(false);
			UnFinishedDeleteGet(userServisId.orderHistoryId);
		} else {
			setSelected(true);
			let { templateId } = temps[index];
			getTempeditData(templateId).then(({ data }) => {
				setObjects(data);
			});
		}
	};

	const back = () => {
		setSelected("");
		setisdisabled(true);
	};

	const oldPageChange = (p, s) => {
		GetAllUserMedCardEnabled(userServisId.userId, p, s).then(res => {
			setUsedMedCards(res.data.content);
		});
	};

	const handleCancel = () => {
		if (selected) {
			GetAllUserMedCardEnabled(userServisId.userId).then(res => {
				setUsedMedCards(res.data.content);
				setshowOldMedCars(true);
			});
		} else {
			setVisible(false);
		}
	};

	const fileRemove = file => {
		let udiObjects = filesId.filter(item => item.uid !== file.uid);
		let uidObj = filesId.filter(item => item.uid === file.uid);
		if (uidObj.length)
			deleteUploadFile(uidObj[0].orderHistoryId, userServisId.userId).then(() => {
				if (uidObj.length) setFilesId(udiObjects);
			});
	};

	const fileDownload = file => {
		let [uidObj] = filesId.filter(item => item.uid === file.uid);
		if (uidObj) getUploadFile(uidObj.orderHistoryId, file.name);
	};

	const fileRequest = ({ file, onError, onProgress, onSuccess }) => {
		let formData = new FormData();
		formData.append("file", file);
		orderFileUpload(formData, onProgress, userServisId.userId)
			.then(({ data }) => {
				setFilesId(prev => [
					...prev,
					{
						orderHistoryId: data,
						uid: file.uid,
					},
				]);
				onSuccess();
			})
			.catch(() => {
				onError();
			});
	};

	return (
		<React.Fragment>
			{loading ? (
				<Skeleton key="bookingskeleton" active />
			) : (
				<Table
					title={() => (
						<Space>
							<Search key={1} placeholder="Поиск" onSearch={value => console.log(value)} style={{ width: 200 }} />
						</Space>
					)}
					pagination={{
						current: currentPage,
						total: totalElements,
						pageSize: 10,
						onChange: handlePaginationChange,
						showTotal: totalElements => `ВСЕ: ${totalElements}`,
					}}
					tableLayout="fixed"
					bordered
					size="small"
					columns={studentColumns}
					dataSource={listColumns}
					rowKey={item => item.orderId}
					scroll={{ x: 800 }}
					className="w-100"
					loading={bookingloading}
				/>
			)}
			<Modal
				name="eskikarta"
				key="eskikarta"
				width={1000}
				centered
				visible={showOldMedCars}
				title={"Eski medkartalar ro'yxati"}
				onCancel={() => setshowOldMedCars(false)}>
				<Table
					pagination={{
						current: currentPage,
						total: totalElements,
						pageSize: 10,
						onChange: oldPageChange,
						showTotal: totalElements => `ВСЕ: ${totalElements}`,
					}}
					tableLayout="fixed"
					bordered
					size="small"
					dataSource={usedMedCards}
					rowKey={e => e.madCardId}
					columns={oldtreatedcolumns}
				/>
			</Modal>
			<ModalOldOnes
				fileUrls={fileUrls}
				name="oldones"
				key="oldones"
				visible={isShow}
				byIdOldOnes={byIdOldOnes}
				onCancel={oldOnCancel}
			/>
			<Modal
				name="mainMOdal"
				key="mainMOdal"
				onOk={next}
				okButtonProps={{ disabled: isdisabled }}
				onCancel={handleCancel}
				okText={selected ? "Сохранить" : "Следующий"}
				cancelText={selected ? "предыдущие медицинские карты" : "отмена"}
				visible={visible}
				closable={false}
				maskClosable={false}
				title={[
					<div>
						{selected && (
							<Tag onClick={back}>
								<TiArrowBackOutline />
							</Tag>
						)}
						<span>Медицинская карта пациента</span>
					</div>,
				]}
				className="w-100">
				{selected ? (
					<Tabs tabPosition="left">
						<TabPane tab="Информация о пациенте" key="1">
							<UserMedForm userId={userServisId.userId} useMedForm={useMedForm} />
						</TabPane>
						{objects.map((item, index) => (
							<TabPane forceRender={true} tab={`Шаблон №${index}`} key={index + 3}>
								<Form name="useMedForm" form={orderObjForm} {...layout}>
									<Form.Item
										initialValue={item.context}
										noStyle
										name={`context/${index}`}
										key={`context/${index}`}
										getValueFromEvent={(_, editor) => editor.getData()}>
										<CKEditor editor={ClassicEditor} data={item.context} />
									</Form.Item>
								</Form>
							</TabPane>
						))}
						<TabPane tab="File upload" key="1000">
							<Upload
								multiple
								listType="picture"
								onRemove={fileRemove}
								onDownload={fileDownload}
								customRequest={fileRequest}
								showUploadList={{
									showDownloadIcon: true,
									downloadIcon: <DownloadOutlined />,
								}}>
								<Button type="primary">Upload</Button>
							</Upload>
						</TabPane>
					</Tabs>
				) : (
					<div>
						<MedCardFilter setTemps={setTemps} />
						<Radio.Group
							buttonStyle="solid"
							className="w-100"
							size="middle"
							onChange={e => {
								setIndex(e.target.value);
								setisdisabled(false);
							}}>
							<Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
								<TabPane tab="Стандарт" key="1">
									<div className="booking_modal_cont">
										{temps.map((item, index) => (
											<Card
												key={index}
												title={
													<div className="temp_maincont_card_head">
														<span className="temp_maincont_card_tit">{item.title}</span>
														<Radio.Button key={index + 50} value={index}>
															<FileAddOutlined />
														</Radio.Button>
													</div>
												}
												className="temp_card"
												hoverable>
												{item.description}
											</Card>
										))}
									</div>
								</TabPane>
								<TabPane tab="Сохранено" key="2">
									<div className="booking_modal_cont">
										{temps.map((item, index) => (
											<Card
												key={index}
												title={
													<div className="temp_maincont_card_head">
														<span className="temp_maincont_card_tit">{item.title}</span>
														<Radio.Button key={index + 100} value={index}>
															<FileAddOutlined />
														</Radio.Button>
													</div>
												}
												className="temp_card"
												hoverable>
												{item.description}
											</Card>
										))}
									</div>
								</TabPane>
							</Tabs>
						</Radio.Group>
					</div>
				)}
			</Modal>
		</React.Fragment>
	);
};

export default BookingsP;

import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Form,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  Button,
  Divider,
  message,
} from "antd";
import moment from "moment";
import {
  getAuthFormData,
  getDataAuth,
  sendDataAuth,
} from "../server/config/common";
import { UZ } from "../data/Uz";

const UserMedForm = ({ useMedForm, userId }) => {
  const lan = UZ;
  const [isFemale, setIsFemale] = useState(false);
  const [buttonLoading] = useState(false);
  const [isDrinking, setIsDrinking] = useState(0);
  const [isSmoking, setIsSmoking] = useState(0);

  useEffect(() => {
    getDataAuth("user-profile/").then((res) => {
      res.data.gender === "FEMALE" && setIsFemale(true);
    });
    getAuthFormData(userId).then((res) => {
      if (res) {
        let medInfo = JSON.parse(res.data.context);
        if (medInfo) {
          useMedForm.setFieldsValue({
            ...medInfo,
            timeStartedSexualLife: medInfo.timeStartedSexualLife
              ? moment(medInfo.timeStartedSexualLife)
              : null,
            dateOfBirth: medInfo ? moment(medInfo.dateOfBirth) : null,
            fromWhatYearDrinking: medInfo.fromWhatYearDrinking
              ? moment(medInfo.fromWhatYearDrinking)
              : null,
            fromWhatYearSmoking: medInfo.fromWhatYearSmoking
              ? moment(medInfo.fromWhatYearSmoking)
              : null,
          });
          if (medInfo.hasOwnProperty("drinkingAlcogol")) {
            if (medInfo.drinkingAlcogol) setIsDrinking(medInfo.drinkingAlcogol);
          }
          if (medInfo.hasOwnProperty("smoking")) {
            if (medInfo.smoking) setIsSmoking(medInfo.smoking);
          }
        }
      }
    });
  }, [userId, useMedForm]);

  const onFinish = (values) => {
    sendDataAuth({
      medInfo: JSON.stringify({
        ...values,
        timeStartedSexualLife: values.timeStartedSexualLife
          ? values.timeStartedSexualLife.format("YYYY-MM-DD")
          : null,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
        fromWhatYearDrinking: values.fromWhatYearDrinking
          ? values.fromWhatYearDrinking.format("YYYY-MM-DD")
          : null,
        fromWhatYearSmoking: values.fromWhatYearSmoking
          ? values.fromWhatYearSmoking.format("YYYY-MM-DD")
          : null,
      }),
      userId,

    }).then(() => message.success("Ma'lumotlar muvaffaqiyatli saqlandi",[0.6])).catch(() => message.error("Ma'lumotlarni saqlashda qandaydir muammo bor!!!",[0.6]))
  };

  return (
    <Col span={24}>
      <div className="card flex-grow-1">
        <div className="card-body">
          <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            form={useMedForm}
            onFinish={onFinish}
            name="medInfo"
          >
            <h4 className="text-center">{lan.biologicData}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.placeOfBirth}
                  name="placeOfBirth"
                  key="placeOfBirth"
                >
                  <Input placeholder={lan.placeOfBirth} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.dateOfBirth}
                  name="dateOfBirth"
                  key="dateOfBirth"
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    placeholder={lan.dateOfBirth}
                  />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.numberOfChildrenInFamily}
                  name="numberOfChildrenInFamily"
                  key="numberOfChildrenInFamily"
                >
                  <Input placeholder={lan.numberOfChildrenInFamily} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.peopleLivedWithIll}
                  name="peopleLivedWithIll"
                  key="peopleLivedWithIll"
                >
                  <Input placeholder={lan.peopleLivedWithIll} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item label={lan.degree} name="degree" key="degree">
                  <Select placeholder={lan.degree}>
                    {lan.degreeOptions.map((item, index) => (
                      <Select.Option value={index} key={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {isFemale && (
              <>
                <h4 className="text-center">{lan.sexualHistory}</h4>
                <Divider />
                <Row gutter={[8, 8]}>
                  <Col md={12} span={24}>
                    <Form.Item
                      label={lan.timeStartedSexualLife}
                      name="timeStartedSexualLife"
                      key="timeStartedSexualLife"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        picker="year"
                        placeholder={lan.timeStartedSexualLife}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item
                      label={lan.menarche}
                      name="menarche"
                      key="menarche"
                    >
                      <Input placeholder={lan.menarche} />
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item
                      label={lan.menstruation}
                      name="menstruation"
                      key="menstruation"
                    >
                      <Select placeholder={lan.menstruation}>
                        {lan.menstruationOptions.map((item, index) => (
                          <Select.Option value={index} key={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item
                      label={lan.pregnancy}
                      name="pregnancy"
                      key="pregnancy"
                    >
                      <Select placeholder={lan.pregnancy}>
                        <Select.Option value={1} key={1}>
                          {lan.yes}
                        </Select.Option>
                        <Select.Option value={0} key={0}>
                          {lan.no}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item
                      label={lan.numberOfAbortions}
                      name="numberOfAbortions"
                      key="numberOfAbortions"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={lan.numberOfAbortions}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <h4 className="text-center">{lan.maritalStatus}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.marriedStatusIll}
                  name="marriedStatusIll"
                  key="marriedStatusIll"
                >
                  <Select placeholder={lan.marriedStatusIll}>
                    <Select.Option value={1} key={1}>
                      {lan.married}
                    </Select.Option>
                    <Select.Option value={0} key={0}>
                      {lan.single}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.numberChildren}
                  name="numberChildren"
                  key="numberChildren"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={lan.numberChildren}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h4 className="text-center">{lan.laborHistory}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.ageStartedWork}
                  name="ageStartedWork"
                  key="ageStartedWork"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={lan.ageStartedWork}
                  />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.characterAndconditionCurrentWork}
                  name="characterAndconditionCurrentWork"
                  key="characterAndconditionCurrentWork"
                >
                  <Input placeholder={lan.characterAndconditionCurrentWork} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.disadvantagesOfProfession}
                  name="disadvantagesOfProfession"
                  key="disadvantagesOfProfession"
                >
                  <Input placeholder={lan.disadvantagesOfProfession} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.allPlacesWorked}
                  name="allPlacesWorked"
                  key="allPlacesWorked"
                >
                  <Input placeholder={lan.allPlacesWorked} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.typeLabor}
                  name="typeLabor"
                  key="typeLabor"
                >
                  <Select placeholder={lan.typeLabor}>
                    <Select.Option value={1} key={1}>
                      {lan.mental}
                    </Select.Option>
                    <Select.Option value={0} key={0}>
                      {lan.physical}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.processLabor}
                  name="processLabor"
                  key="processLabor"
                >
                  <Select placeholder={lan.processLabor}>
                    <Select.Option value={0} key={0}>
                      {lan.whileSitting}
                    </Select.Option>
                    <Select.Option value={1} key={1}>
                      {lan.whileStanding}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.conditionCurrentLabor}
                  name="conditionCurrentLabor"
                  key="conditionCurrentLabor"
                >
                  <Select placeholder={lan.conditionCurrentLabor}>
                    <Select.Option key="1" value={0}>
                      {lan.underGround}
                    </Select.Option>
                    <Select.Option key="2" value={1}>
                      {lan.openAir}
                    </Select.Option>
                    <Select.Option key="3" value={2}>
                      {lan.inRoom}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.temperature}
                  name="temperature"
                  key="temperature"
                >
                  <Select placeholder={lan.temperature}>
                    <Select.Option key="1" value={0}>
                      {lan.low}
                    </Select.Option>
                    <Select.Option key="2" value={1}>
                      {lan.middle}
                    </Select.Option>
                    <Select.Option key="3" value={3}>
                      {lan.high}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.lightness}
                  name="lightness"
                  key="lightness"
                >
                  <Select placeholder={lan.lightness}>
                    <Select.Option key="1" value={0}>
                      {lan.light}
                    </Select.Option>
                    <Select.Option key="2" value={1}>
                      {lan.middlelight}
                    </Select.Option>
                    <Select.Option key="3" value={2}>
                      {lan.dark}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}></Col>
            </Row>
            <h4 className="text-center">{lan.harmfulHabits}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.drinkingAlcogol}
                  name="drinkingAlcogol"
                  key="drinkingAlcogol"
                >
                  <Select
                    placeholder={lan.drinkingAlcogol}
                    onChange={(e) => setIsDrinking(e)}
                    value={isDrinking}
                  >
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
                {isDrinking === 1 && (
                  <>
                    <Form.Item
                      label={lan.fromWhatYear}
                      name="fromWhatYearDrinking"
                      key="fromWhatYearDrinking"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        picker="year"
                        placeholder={lan.fromWhatYear}
                      />
                    </Form.Item>
                    <Form.Item
                      label={lan.inWhatQuantity}
                      name="inWhatQuantityDrinking"
                      key="inWhatQuantityDrinking"
                    >
                      <Input placeholder={lan.inWhatQuantity} />
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col md={12} span={24}>
                <Form.Item label={lan.smoking} name="smoking" key="smoking">
                  <Select
                    placeholder={lan.smoking}
                    onChange={(e) => setIsSmoking(e)}
                    value={isSmoking}
                  >
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
                {isSmoking === 1 && (
                  <>
                    <Form.Item
                      label={lan.fromWhatYear}
                      name="fromWhatYearSmoking"
                      key="fromWhatYearSmoking"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        picker="year"
                        placeholder={lan.fromWhatYear}
                      />
                    </Form.Item>
                    <Form.Item
                      label={lan.inWhatQuantity}
                      name="inWhatQuantitySmoking"
                      key="inWhatQuantitySmoking"
                    >
                      <Input placeholder={lan.inWhatQuantity} />
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.drinkOfIll}
                  name="drinkOfIll"
                  key="drinkOfIll"
                >
                  <Select placeholder={lan.drinkOfIll} mode="multiple">
                    <Select.Option key="1" value={0}>
                      {lan.bitterTea}
                    </Select.Option>
                    <Select.Option key="2" value={1}>
                      {lan.cofe}
                    </Select.Option>
                    <Select.Option key="3" value={2}>
                      {lan.drugs}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.passedSickness}
                  name="passedSickness"
                  key="passedSickness"
                >
                  <Input placeholder={lan.passedSickness} />
                </Form.Item>
              </Col>
            </Row>
            <h4 className="text-center">{lan.allergologicHistory}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.specificAllergens}
                  name="specificAllergens"
                  key="specificAllergens"
                >
                  <Input placeholder={lan.specificAllergens} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.reactionToMedicine}
                  name="reactionToMedicine"
                  key="reactionToMedicine"
                >
                  <Input placeholder={lan.reactionToMedicine} />
                </Form.Item>
              </Col>
            </Row>
            <h4 className="text-center">{lan.reactionToMedicine}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.allergySymptoms}
                  name="allergySymptoms"
                  key="allergySymptoms"
                >
                  <Input placeholder={lan.allergySymptoms} />
                </Form.Item>
              </Col>
            </Row>
            <h4 className="text-center">{lan.epidemilogicalHistory}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.haveJaundice}
                  name="haveJaundice"
                  key="haveJaundice"
                >
                  <Select placeholder={lan.haveJaundice}>
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.receivedBloodTransfusion}
                  name="receivedBloodTransfusion"
                  key="receivedBloodTransfusion"
                >
                  <Select placeholder={lan.receivedBloodTransfusion}>
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.haveContactWithInfectedPatients}
                  name="haveContactWithInfectedPatients"
                  key="haveContactWithInfectedPatients"
                >
                  <Select placeholder={lan.haveContactWithInfectedPatients}>
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.withWhatInfectiousPatient}
                  name="withWhatInfectiousPatient"
                  key="withWhatInfectiousPatient"
                >
                  <Select placeholder={lan.withWhatInfectiousPatient}>
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.haveBeenAbroadOrDentist}
                  name="haveBeenAbroadOrDentist"
                  key="haveBeenAbroadOrDentist"
                >
                  <Select placeholder={lan.haveBeenAbroadOrDentist}>
                    <Select.Option key="1" value={1}>
                      {lan.yes}
                    </Select.Option>
                    <Select.Option key="2" value={0}>
                      {lan.no}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.countriesWent}
                  name="countriesWent"
                  key="countriesWent"
                >
                  <Input placeholder={lan.countriesWent} />
                </Form.Item>
              </Col>
            </Row>
            <h4 className="text-center">{lan.hereditaryDiseasesParents}</h4>
            <Divider />
            <Row gutter={[8, 8]}>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.hereditaryPredisposition}
                  name="hereditaryPredisposition"
                  key="hereditaryPredisposition"
                >
                  <Input placeholder={lan.hereditaryPredisposition} />
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item
                  label={lan.halthOfCloseRelatives}
                  name="halthOfCloseRelatives"
                  key="halthOfCloseRelatives"
                >
                  <Input placeholder={lan.halthOfCloseRelatives} />
                </Form.Item>
              </Col>
            </Row>
            <div className="d-flex justify-content-between">
              <Form.Item key="submit">
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={buttonLoading}
                  disabled={buttonLoading}
                >
                  {lan.save}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default UserMedForm;

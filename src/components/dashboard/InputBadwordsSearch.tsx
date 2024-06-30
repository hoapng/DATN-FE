import React from "react";
import { Button, Col, Form, Input, Row, theme } from "antd";

const InputBadwordsSearch = (props: any) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    let query = {};
    if (values.word) {
      query = {
        ...query,
        word: `/${values.word}/i`,
      };
    }
    if (query) {
      props.handleSearch(query);
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`word`}
            label={`word`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              props.setFilter("");
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputBadwordsSearch;

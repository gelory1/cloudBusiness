<template>
  <div class="reportform layout">
    <Row class="group">
      <Row>
        <div class="title">资产统计</div>
      </Row>
      <Row>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">发货统计</div>
              </Row>
              <Row>
                <div class="box-content">日报、月报、自定义时段</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">库存统计</div>
              </Row>
              <Row>
                <div class="box-content">云成品库、物资库存统计</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">安装上线统计</div>
              </Row>
              <Row>
                <div class="box-content">云公司/各线下管理公司/线下服务商发货、安装、上线情况</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">在线物资运行统计</div>
              </Row>
              <Row>
                <div class="box-content">在线运行设备物资月度统计、年度统计</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">工程物资盘点</div>
              </Row>
              <Row>
                <div class="box-content">线下服务商工程物资库实时盘点统计</div>
              </Row>
            </Col>
          </div>
        </Col>
      </Row>
    </Row>

    <Row class="group">
      <Row>
        <div class="title">运营业务统计</div>
      </Row>
      <Row>
        <Col :span="6">
          <div class="box" @click="openForm(1202, '/reportform/stock')">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">备货与结算统计</div>
              </Row>
              <Row>
                <div class="box-content">渠道备货、抵扣、结算、库存</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box" @click="openForm(1201, '/reportform/delivery')">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">发货台账统计</div>
              </Row>
              <Row>
                <div class="box-content">合同订单发货统计</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">合同款账统计</div>
              </Row>
              <Row>
                <div class="box-content">应收、实收/回款、开票等状态分类统计</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">合同签约统计分析</div>
              </Row>
              <Row>
                <div class="box-content">签约金额、用户数、达成率、成本利润分析</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box" @click="openForm(1205, '/reportform/indicator')">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">平台运营指标</div>
              </Row>
              <Row>
                <div class="box-content">统计平台的各项指标数据（准确率、达成率、用户活跃度等）</div>
              </Row>
            </Col>
          </div>
        </Col>
      </Row>
    </Row>

    <Row class="group">
      <Row>
        <div class="title">财务统计</div>
      </Row>
      <Row>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">资产折旧报表</div>
              </Row>
              <Row>
                <div class="box-content">上线物资设备资产折旧</div>
              </Row>
            </Col>
          </div>
        </Col>
        <Col :span="6">
          <div class="box">
            <Col :span="8">
              <div class="box-img">
                <img src />
              </div>
            </Col>
            <Col :span="16">
              <Row>
                <div class="box-title">备货与合同对账报表</div>
              </Row>
              <Row>
                <div class="box-content">备货金、抵扣合同、合同付款账务</div>
              </Row>
            </Col>
          </div>
        </Col>
      </Row>
    </Row>
  </div>
</template>

<script>
export default {
  name: "reportForm",
  methods: {
    openForm(id, url) {
      if (!this.$store.state.app.authority.find(a => a.id === id)) {
        this.$Message.error("权限不足！");
        return;
      }
      this.$router.push({ path: url });
    }
  }
};
</script>

<style scoped>
.reportform {
  background: #fff;
  padding: 20px;
}
.group {
  padding-bottom: 20px;
}
.title {
  font-size: 18px;
  padding-bottom: 20px;
  color: #000;
}
.box {
  box-sizing: border-box;
  height: 120px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
}
.box .box-img {
  height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin: 10px;
  background-image: url("../../images/report/report.png");
  background-position: center;
  background-size: 55%;
  background-repeat: no-repeat;
}
.box-title {
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #333;
}
.box-content {
  padding-top: 10px;
  font-size: 14px;
  padding-left: 10px;
  color: #868686;
}
</style>
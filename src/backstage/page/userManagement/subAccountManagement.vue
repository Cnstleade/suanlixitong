<template>
    <div class="containers">
        <el-row>
            <el-alert
              title="子账户管理"
              :closable="false"
            type="success">
            </el-alert>           
        </el-row>
        <el-row class="mt-4 d-flex flex-row flex-nowrap justify-content-end">
            <div style="flex-grow:1" >
                <el-button  icon="el-icon-plus" @click="handleAdd" type="primary">新增</el-button>
            </div>             
            <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
             <el-form-item>
                  <el-button type="success" @click="reset">重置</el-button>
              </el-form-item> 
             <el-form-item  label-width="100px">
               <el-input v-model.number="formInline.sid"  placeholder="请选择排班表编号" ></el-input>
             </el-form-item> 
             <el-form-item  label-width="100px">
               <el-input v-model.number="formInline.rotaId" placeholder="请选择值班员编号编号"  ></el-input>
             </el-form-item>                           
              <el-form-item>
                <el-select v-model="formInline.wtCategory" placeholder="请选择班次类别" >
                    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>                  
             </el-form-item>              
              <el-form-item >
                  <el-date-picker
                      v-model="formInline.time"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>                
              </el-form-item>              
              <el-form-item>
                <el-button @click="handleSearch" class="mr-4"  icon="el-icon-search"  type="success" circle></el-button>
              </el-form-item>
            </el-form>             -->
        </el-row>
        <el-table
            :data="tableData"  
            border  
            ref="multipleTable" 
            tooltip-effect="dark"
            highlight-current-row   id="darkCell"
            style="width: 100%;font-weight:bold"
            class="mt-3"
            v-loading="loading">
            <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
            <el-table-column prop="minerAccount" label="子账号" align="center" min-width="100"></el-table-column>
            <el-table-column prop="key" label="key" align="center" width="150">
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.key" placement="top">
                      <span>{{scope.row.key}}</span>
                  </el-tooltip>
              </template>   
            </el-table-column>
            <el-table-column prop="code" label="code" align="center" min-width="100"></el-table-column>
            <el-table-column prop="type" label="所属池" align="center" width="100">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.type==1?'success':''">
                  {{scope.row.type==1?'BTC池':''}}
                </el-tag>
              </template>
            </el-table-column>    
            <el-table-column prop="createTime" label="创建时间" align="center" min-width="100">
                <template slot-scope="scope">
                    {{scope.row.createTime|dateServer}}
                </template>                 
            </el-table-column>  
            <el-table-column prop="currency" label="币种" align="center" width="100">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.currency==1?'success':''">
                  {{scope.row.currency==1?'比特币':''}}
                </el-tag>
              </template>
            </el-table-column> 
            <el-table-column prop="minersName" label="矿场名" align="center" width="100">
            </el-table-column>                                              
            <el-table-column label="操作" align="center" min-width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>            
        </el-table>
        <el-row class="mt-4" v-if="total>0">
             <div style="float:right">
                 <el-pagination
                   @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                   :current-page="npage"
                    :page-sizes="[10, 20, 50, 100, 1000,990000]"
                     :page-size="pagesize"
                   background
                   layout="total,sizes,prev, pager, next,jumper"
                   :total="total">
                 </el-pagination>   
             </div>
        </el-row>         
        <el-dialog 
            title="编辑子账号" 
            :visible.sync="dialogFormEditVisible" 
            center
            width="30%"
            >
          <el-form :model="editForm" ref="editForm" :rules="rules" >
            <el-form-item label="ID" label-width="100px">
              <el-input v-model.number="editForm.id" autocomplete="off" disabled></el-input>
            </el-form-item>              
            <el-form-item label="子账号" label-width="100px">
              <el-input v-model="editForm.minerAccount" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="key" label-width="100px">
              <el-input v-model="editForm.key" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="code" label-width="100px">
              <el-input v-model="editForm.code" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="子账号所属池" label-width="100px">
                <el-select v-model="editForm.type" placeholder="请选择班次类别" >
                    <el-option v-for="item in types" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" label-width="100px">
                <el-select v-model="editForm.currency" placeholder="请选择工作状态" >
                    <el-option v-for="item in currencys" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>             
            <el-form-item label="矿场名" label-width="100px">
              <el-input v-model="editForm.minersName" autocomplete="off"></el-input>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
          </div>
        </el-dialog> 
        <el-dialog 
            title="新增子账号" 
            :visible.sync="dialogFormAddVisible" 
            center
            width="30%"
            >
          <el-form :model="addForm" ref="addForm" :rules="rules" >
            <el-form-item label="子账号" label-width="100px">
              <el-input v-model="addForm.minerAccount" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="key" label-width="100px">
              <el-input v-model="addForm.key" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="code" label-width="100px">
              <el-input v-model="addForm.code" autocomplete="off"></el-input>
            </el-form-item>            
            <el-form-item label="子账号所属池" label-width="100px">
                <el-select v-model="addForm.type" placeholder="请选择班次类别" >
                    <el-option v-for="item in types" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" label-width="100px">
                <el-select v-model="addForm.currency" placeholder="请选择工作状态" >
                    <el-option v-for="item in currencys" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>             
            <el-form-item label="矿场名" label-width="100px">
              <el-input v-model="addForm.minersName" autocomplete="off"></el-input>
            </el-form-item>           
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormAddVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
          </div>
        </el-dialog>                
    </div> 
</template>
<script>
import { timeFormatD } from "@/config/time";
import {
  httpSysGetadminsubaccountlist, //展示
  httpSysAdminsubaccountinsert, //新增
  httpSysAdminsubaccountupdate //修改
} from "@/service/http";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      npage: 1,
      pagesize: 10,
      total: 0,
      dialogVisible: false,
      formInline: {},
      editForm: {},
      addForm: {},
      dialogFormEditVisible: false,
      dialogFormAddVisible: false,
      rules: {},
      types: [
        {
          value: 1,
          label: "BTC池"
        },
        {
          value: 2,
          label: "中班"
        },
        {
          value: 3,
          label: "晚班"
        },
        {
          value: 4,
          label: "替班"
        },
        {
          value: 5,
          label: "常班"
        }
      ],
      currencys: [
        {
          value: 1,
          label: "比特币"
        },
        {
          value: 2,
          label: "休息中"
        },
        {
          value: 3,
          label: "请假中"
        },
        {
          value: 4,
          label: "旷工中"
        }
      ]
    };
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      "loginId"
      // ...
    ])
  },
  methods: {
    changeDialog() {},
    handleEdit(index, row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      this.dialogFormEditVisible = true;
    },
    handleAdd() {
      this.addForm = {};
      this.dialogFormAddVisible = true;
    },
    /* 后台管理模块 /排班管理——根据排班表编号、值班员编号、工作班次类别或工作日期对排班记录进行分页查询 */
    _init(npage, pagesize) {
      this.loading = true;
      httpSysGetadminsubaccountlist(npage, pagesize)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.allPageNumber;
            this.$message({
              message: "查询成功",
              type: "success"
            });
          } else {
            this.tableData = null;
            this.total = 0;
            this.$message({
              message: data.msg,
              type: "error"
            });
          }
          this.loading = false;
        })
    },
    /* 后台管理模块 / 新增排班记录 */
    handleAddForm(
      loginId,
      minerAccount,
      key,
      code,
      type,
      currency,
      minersName
    ) {
      httpSysAdminsubaccountinsert(
        loginId,
        minerAccount,
        key,
        code,
        type,
        currency,
        minersName
      ).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.dialogFormAddVisible = false;
          setTimeout(() => {
            this.reset();
          }, 500);
        } else {
          this.$message({
            message: data.msg,
            type: "error"
          });
        }
      });
    },
    /* 后台管理模块 / 修改矿场 */
    handleEditForm(
      loginId,
      id,
      minerAccount,
      key,
      code,
      type,
      currency,
      minersName
    ) {
      httpSysAdminsubaccountupdate(
        loginId,
        id,
        minerAccount,
        key,
        code,
        type,
        currency,
        minersName
      ).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.$message({
            message: data.msg,
            type: "success"
          });
          this.handleSearch(false);
          this.dialogFormEditVisible = false;
          setTimeout(() => {
            this.handleSearch(false);
          }, 500);
        } else {
          this.$message({
            message: data.msg,
            type: "error"
          });
        }
      });
    },
    /* —根据排班表编号删除对应记录 */
    // handleDelete(index, row) {
    //   this.$confirm("此操作将永久删除该值班员, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this._httpscheduleDelete_scheduling(row.sid);
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    // _httpscheduleDelete_scheduling(sid) {
    //   httpscheduleDelete_scheduling(sid).then(res => {
    //     let data = res.data;
    //     if (data.code == 200) {
    //       this.$message({
    //         message: data.msg,
    //         type: "success"
    //       });
    //       setTimeout(() => {
    //         this.handleSearch(false);
    //       }, 500);
    //     } else {
    //       this.$message({
    //         message: data.msg,
    //         type: "error"
    //       });
    //     }
    //   });
    // },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == "addForm") {
            this.handleAddForm(
              this.loginId,
              this.addForm.minerAccount,
              this.addForm.key,
              this.addForm.code,
              this.addForm.type,
              this.addForm.currency,
              this.addForm.minersName
            );
          }
          if (formName == "editForm") {
            this.handleEditForm(
              this.loginId,
              this.editForm.id,
              this.editForm.minerAccount,
              this.editForm.key,
              this.editForm.code,
              this.editForm.type,
              this.editForm.currency,
              this.editForm.minersName
            );
          }
        } else {
          return false;
        }
      });
    },
    /*   重置 */
    reset() {
      this.formInline = {};
      this.handleSearch();
    },
    /*   选取第几页 */
    handleCurrentChange(val) {
      this.npage = val;
      this.handleSearch(false);
    },
    /* 选取页数 */
    handleSizeChange(val) {
      this.pagesize = val;
      this.handleSearch(false);
    },
    /* 按条件搜索 */
    handleSearch(type = true) {
      if (type) {
        this.npage = 1;
        this.pagesize = 10;
      }
      if (this.formInline.time) {
        this._init(this.npage, this.pagesize);
      } else {
        this._init(this.npage, this.pagesize);
      }
    }
  },
  mounted() {
    this._init(this.npage, this.pagesize);
  }
};
</script>
<style lang="less" scoped>
</style>
<style>
#darkCell .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>


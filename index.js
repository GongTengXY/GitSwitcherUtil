#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const configFilePath = './git-configs.json';

const prompt = inquirer.createPromptModule();


// 读取配置文件
const readConfigs = () => {
  try {
    if (fs.existsSync(configFilePath)) {
        return JSON.parse(fs.readFileSync(configFilePath));
    }
  } catch (error) {
    console.error("Error reading config file:", error);
  }
  return {};
};

// 保存配置文件
const saveConfigs = (configs) => {
    fs.writeFileSync(configFilePath, JSON.stringify(configs, null, 2));
};

// 切换配置
const switchConfig = async () => {
    const configs = readConfigs();
    const keys = Object.keys(configs);

    // 检查是否有可用的配置
    if (keys.length === 0) {
      console.log("No configurations available to switch. Please add configurations first.");
      return; // 退出函数
    }

    const { key } = await prompt([
        {
          type: 'list',
          name: 'key',
          message: 'Select a configuration to switch:',
          choices: keys,
        },
    ]);
    const { name, email } = configs[key];
    // 切换 Git 配置
    await setGitConfig(name, email);
    console.log(`Switched to ${key}: ${name} <${email}>`);

    return true ; // 退出函数
};

// 新增配置
const addConfig = async () => {
    const { key, name, email } = await prompt([
        { type: 'input', name: 'key', message: 'Enter a key for the configuration:' },
        { type: 'input', name: 'name', message: 'Enter your Git name:' },
        { type: 'input', name: 'email', message: 'Enter your Git email:' },
    ]);
    const configs = readConfigs();
    configs[key] = { name, email };
    saveConfigs(configs);
    console.log(`Configuration added for ${key}.`);
};

// 导出配置
const exportConfig = async () => {
    const configs = readConfigs();
    const keys = Object.keys(configs);

    // 检查是否有可用的配置
    if (keys.length === 0) {
      console.log("No configurations available to export. Please add configurations first.");
      return; // 退出函数
    }

    // 提示用户输入导出路径
    const { exportDir } = await prompt([
      {
          type: 'input',
          name: 'exportDir',
          message: 'Enter the path where you want to export the configuration file):',
      },
    ]);

    // 构建完整的文件路径
    const exportPath = `${exportDir}/git-configs.json`;

    // 写入配置到指定路径
    try {
      fs.writeFileSync(exportPath, JSON.stringify(configs, null, 2));
      console.log(`Configurations exported to ${exportPath}.`);
    } catch (error) {
      console.error("Error writing to file:", error);
    }
};

// 设置 Git 配置
const setGitConfig = (name, email) => {
    return new Promise((resolve) => {
        require('child_process').exec(`git config --global user.name "${name}"`, () => {
            require('child_process').exec(`git config --global user.email "${email}"`, resolve);
        });
    });
};

// 更新配置
const updateConfig = async () => {
  const configs = readConfigs();
  const keys = Object.keys(configs);

  // 检查是否有可用的配置
  if (keys.length === 0) {
    console.log("No configurations available to update. Please add configurations first.");
    return; // 退出函数
  }

  const { key } = await prompt([
      {
          type: 'list',
          name: 'key',
          message: 'Select a configuration to update:',
          choices: keys,
      },
  ]);

  const { name, email } = await prompt([
      { type: 'input', name: 'name', message: 'Enter your new Git name:', default: configs[key].name },
      { type: 'input', name: 'email', message: 'Enter your new Git email:', default: configs[key].email },
  ]);

  // 更新配置
  configs[key] = { name, email };
  saveConfigs(configs);
  console.log(`Configuration ${key} has been updated.`);
};

// 删除配置
const deleteConfig = async () => {
  const configs = readConfigs();
  const keys = Object.keys(configs);

  // 检查是否有可用的配置
  if (keys.length === 0) {
    console.log("No configurations available to delete. Please add configurations first.");
    return; // 退出函数
  }

  const { key } = await prompt([
      {
          type: 'list',
          name: 'key',
          message: 'Select a configuration to delete:',
          choices: keys,
      },
  ]);

  // 删除选中的配置
  delete configs[key];
  saveConfigs(configs);
  console.log(`Configuration ${key} has been deleted.`);
};

// 主菜单
const mainMenu = async () => {
  try {
    const { action } = await prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select an action:',
            choices: ['新增配置', '切换配置', '导出全部配置', '更新配置', "删除配置"],
        },
    ]);
    switch (action) {
        case '切换配置':
            const switched = await switchConfig();
            if (switched) return;
            break;
        case '新增配置':
            await addConfig();
            break;
        case '导出全部配置':
            await exportConfig();
            break;
        case '修改配置':
            await updateConfig();
            break;
        case '删除配置':
            await deleteConfig();
            break;
    }
    mainMenu(); // 重新显示菜单
  } catch (error) {
    if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment.");
    } else if (error.name === 'ExitPromptError') {
        // 用户按下 Ctrl+C
        console.log("Exiting the program. Goodbye!");
        process.exit();
    } else {
        console.error("An unexpected error occurred:", error);
    }
  }
};

mainMenu();
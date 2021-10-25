String.prototype.replaceAt = (index, replacement) => this.substr(0, index) + replacement + this.substr(index + replacement.length);
Date.prototype.toString = function() {
  return `${this.getFullYear().toString().padStart(4, "0").slice(0, 4)}-${(this.getMonth() + 1).toString().padStart(2, "0")}-${this.getDate().toString().padStart(2, "0")}`;
}
Date.prototype.add = function(addDay) {
  return new Date(new Date(this).setDate(this.getDate() + addDay));
}

function today() {
  return new Date(new Date().toString());
}
async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

const sampleData = {
  "teams": {
    "ALPHA": {
      "password": "alpha",
      "managers": [
        "386031770216300555"
      ],
      "workers": [
        "457908455810924546",
      ],
      "projects": {
        "대충 존나 쩌는 게임": {
          "tasks": [{
            "title": "기획",
            "members": ["386031770216300555"],
            "from": "2021-09-30",
            "until": "2021-10-05",
            "process": 50,
            "state": "wait",
            "url": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476442743107634"
            },
            "url2": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476443896512512"
            },
            "id": {
              "386031770216300555": "898476442743107634"
            },
            "id2": {
              "386031770216300555": "898476443896512512"
            }
          }, {
            "title": "그림",
            "members": ["386031770216300555"],
            "from": "2021-09-29",
            "until": "2021-10-06",
            "process": 50,
            "state": "wait",
            "url": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476442743107634"
            },
            "url2": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476443896512512"
            },
            "id": {
              "386031770216300555": "898476442743107634"
            },
            "id2": {
              "386031770216300555": "898476443896512512"
            }
          }],
          "from": "2021-09-07"
        },
        "몰라": {
          "tasks": [{
            "title": "기획",
            "members": ["386031770216300555"],
            "from": "2021-10-08",
            "until": "2021-10-16",
            "process": 30,
            "state": "wait",
            "url": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476442743107634"
            },
            "url2": {
              "386031770216300555": "https://discord.com/channels/@me/888714310195499038/898476443896512512"
            },
            "id": {
              "386031770216300555": "898476442743107634"
            },
            "id2": {
              "386031770216300555": "898476443896512512"
            }
          }],
          "from": "2021-09-07"
        }
      },
      "products": {
        "뻘짓": {
          "members": ["386031770216300555"],
          "from": "2021-09-07",
          "until": "2021-09-15",
          "description": "ㅁㄴㅇㄹ",
          "state": "public"
        }
      }
    }
  },
  "tabs": {
    "386031770216300555": {},
    "457908455810924546": {}
  },
  "session": []
};
const data = sampleData;
const teams = data.teams;
const tabs = data.tabs;

const Discord = require("discord.js");
const interactionToken = new Date().valueOf().toString();
const intents = new Discord.Intents(32767);
const client = new Discord.Client({
  intents,
  partials: ["CHANNEL"]
});
let emojis = {};
let sproutServer1;
let sproutServer2;
let channels;
client.on("ready", async () => {
  console.log("READY");
  for (let emoji of [...client.emojis.cache.values()]) {
    emojis[emoji.name] = emoji.toString();
  }
  emojis.w0 = emojis.p0;
  emojis.i0 = emojis.p0;
  emojis.f0 = emojis.p0;
  sproutServer1 = client.guilds.fetch("757598917801279488");
  sproutServer2 = client.guilds.fetch("890754725853691945");
  for (let user of Object.keys(tabs)) {
    await client.users.cache.get(user).send("ㅤ");
  }
  channels = client.channels.cache.filter(ch => ch.type == "DM");
});
Discord.User.prototype.oldSend = Discord.User.prototype.send;
Discord.User.prototype.send = function(message) {
  return new Promise((resolve, reject) => {
    this.oldSend(message).then((msg) => {
      resolve(msg);
    }).catch((err) => {
      resolve({
        id: undefined,
        deleted: true
      });
    });
  });
}
Discord.GuildMember.prototype.oldSend = Discord.GuildMember.prototype.send;
Discord.GuildMember.prototype.send = function(message) {
  return new Promise((resolve, reject) => {
    this.oldSend(message).then((msg) => {
      resolve(msg);
    }).catch((err) => {
      resolve(undefined);
    });
  });
}
Discord.MessageManager.prototype.oldFetch = Discord.MessageManager.prototype.fetch;
Discord.MessageManager.prototype.fetch = function(id) {
  if (id) {
    return new Promise((resolve, reject) => {
      this.oldFetch(id).then((message) => {
        resolve(message);
      }).catch((err) => {
        resolve(undefined);
      });
    });
  } else {
    return undefined;
  }
}
Discord.Channel.prototype.notice = async function(embed) {
  const m = await this.send({
    embeds: [embed]
  });
  await delay(3000);
  if (!m.deleted) {
    m.delete();
  }
}
Discord.Channel.prototype.ask = function(filter, time) {
  return new Promise(
    resolve => {
      const collector = this.createMessageCollector({
        filter,
        time
      });
      collector.on("collect", async m => {
        collector.stop();
        resolve(m.content);
      });
      collector.on("end", async collected => {
        if (collected.size == 0) {
          resolve(undefined);
        }
      });
    }
  );
}
const STATECOLOR = {
  "progress": "#2E86C1",
  "wait": "#F1C40F",
  "issue": "#E74C3C",
  "finish": "#239B56"
};
const STATEEMOJI = {
  "progress": "🔵",
  "wait": "🟡",
  "issue": "🔴",
  "finish": "🟢"
};

const cron = require("cron");

const ChartJSImage = require("chart.js-image");

Discord.GuildMember.prototype.project = async function(team, project) {
  if (Object.keys(teams[team].projects).length == 0) {
    if (!tabs[this.id][team]) {
      tabs[this.id][team] = {};
    }
    tabs[this.id][team].managerUI = (await this.send({
      embeds: [
        new Discord.MessageEmbed().setTitle("📝 **PROJECTS**").setDescription("생성된 프로젝트가 없습니다.").setFooter(team)
      ],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("addProject").setLabel("➕ADD").setStyle("PRIMARY")
        ),
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("projects").setLabel("📝PROJECTS").setStyle("PRIMARY").setDisabled(),
          new Discord.MessageButton().setCustomId("community").setLabel("🌱COMMUNITY").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("finance").setLabel("🏦FINANCE").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("products").setLabel("📦PRODUCTS").setStyle("SECONDARY")
        )
      ]
    })).id;
    return true
  } else {
    const currentProject = teams[team].projects[project];
    const progress = currentProject.tasks.reduce((sum, task) => sum + ((new Date(task.until) - new Date(task.from)) / 86400000 + 1) / 100 * task.process, 0) / currentProject.tasks.reduce((sum, task) => sum + (new Date(task.until) - new Date(task.from)) / 86400000 + 1, 0) * 100;
    const startDay = new Date(currentProject.from);
    const endDay = new Date(currentProject.tasks.reduce((prev, next) => (prev > next.until ? prev : next.until), "0000-00-00"));
    if (!tabs[this.id][team]) {
      tabs[this.id][team] = {};
    }
    tabs[this.id][team].managerUI = (await this.send({
      embeds: [
        new Discord.MessageEmbed().setTitle(`📈 **프로젝트 진행률** - _${Math.floor(progress * 100) / 100}%_`).setThumbnail(
          ChartJSImage().chart({
            type: "doughnut",
            data: {
              options: {
                legend: {
                  display: false
                }
              },
              datasets: [{
                backgroundColor: ["#239B56", "#FFFFFF"],
                data: [progress, 100 - progress]
              }]
            }
          }).backgroundColor("transparent").width(450).height(450).toURL()
        ).setDescription(`**${(today() - startDay) / 86400000 + 1}일차**`).addFields({
          name: "적절 진행률",
          value: Math.min(100, Math.max(0, Math.floor((today() - startDay + 86400000) / (endDay - startDay + 86400000) * 10000) / 100)).toString() + "%"
        }, {
          name: "시작일",
          value: startDay.toString(),
          inline: true
        }, {
          name: "마감일",
          value: endDay.toString(),
          inline: true
        }, {
          name: "예상 완료일",
          value: (startDay <= today()) ? new Date(new Date(startDay.toString()).setDate(startDay.getDate() + Math.ceil((((today() - startDay + 86400000) * 100 / progress) - 86400000) / 86400000))).toString() : "계산 불가"
        }).setAuthor(project).setFooter(team),
        new Discord.MessageEmbed().setTitle(`📝 **PROJECTS**`).addFields({
          name: "🔵 진행중",
          value: currentProject.tasks.filter(task => task.state == "progress").length.toString(),
          inline: true
        }, {
          name: "🟡 대기중",
          value: currentProject.tasks.filter(task => task.state == "wait").length.toString(),
          inline: true
        }, {
          name: "🔴 문제 생김",
          value: currentProject.tasks.filter(task => task.state == "issue").length.toString(),
          inline: true
        }, {
          name: "🟢 완료",
          value: currentProject.tasks.filter(task => task.state == "finish").length.toString(),
          inline: true
        }).setThumbnail(
          ChartJSImage().chart({
            type: "doughnut",
            data: {
              options: {
                legend: {
                  display: false
                }
              },
              datasets: [{
                data: [
                  currentProject.tasks.filter(task => task.state == "progress").length,
                  currentProject.tasks.filter(task => task.state == "wait").length,
                  currentProject.tasks.filter(task => task.state == "issue").length,
                  currentProject.tasks.filter(task => task.state == "finish").length
                ],
                backgroundColor: [
                  "#2E86C1",
                  "#F1C40F",
                  "#E74C3C",
                  "#239B56"
                ]
              }]
            }
          }).backgroundColor("transparent").width(450).height(450).toURL()
        ).setImage(
          ChartJSImage().chart({
            type: "horizontalBar",
            options: {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    max: 100
                  }
                }],
                yAxes: [{
                  barPercentage: 0.5
                }]
              }
            },
            data: {
              labels: currentProject.tasks.map(task => task.title),
              datasets: [{
                data: currentProject.tasks.map(task => task.process),
                backgroundColor: currentProject.tasks.map(task => STATECOLOR[task.state])
              }]
            }
          }).backgroundColor("transparent").toURL()
        )
      ],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("addProject").setLabel("➕ADD").setStyle("PRIMARY"),
          new Discord.MessageButton().setCustomId("deleteProject").setLabel("❌DELETE").setStyle("DANGER"),
          new Discord.MessageButton().setCustomId("finishProject").setLabel("✅FINISH").setStyle("SUCCESS")
        ),
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageSelectMenu().setCustomId("projectList").setPlaceholder(project).addOptions(Object.keys(teams[team].projects).map((title) => ({
            label: title,
            value: title
          })))
        ),
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("projects").setLabel("📝PROJECTS").setStyle("PRIMARY").setDisabled(),
          new Discord.MessageButton().setCustomId("schedule").setLabel("📅SCHEDULE").setStyle("SECONDARY"),
          new Discord.MessageButton().setCustomId("finance").setLabel("🏦FINANCE").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("products").setLabel("📦PRODUCTS").setStyle("SECONDARY")
        )
      ]
    })).id;
    return true;
  }
};
Discord.User.prototype.project = Discord.GuildMember.prototype.project;

Discord.GuildMember.prototype.product = async function(team, product) {
  if (Object.keys(teams[team].products).length == 0) {
    if (!tabs[this.id][team]) {
      tabs[this.id][team] = {};
    }
    tabs[this.id][team].managerUI = (await this.send({
      embeds: [
        new Discord.MessageEmbed().setTitle("📦 **PRODUCTS**").setDescription("등록된 제품이 없습니다.").setFooter(team)
      ],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("projects").setLabel("📝PROJECTS").setStyle("SECONDARY"),
          new Discord.MessageButton().setCustomId("community").setLabel("🌱COMMUNITY").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("finance").setLabel("🏦FINANCE").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("products").setLabel("📦PRODUCTS").setStyle("PRIMARY").setDisabled()
        )
      ]
    })).id;
    return true;
  } else {
    const currentProduct = teams[team].products[product];
    if (!tabs[this.id][team]) {
      tabs[this.id][team] = {};
    }
    tabs[this.id][team].managerUI = (await this.send({
      embeds: [
        new Discord.MessageEmbed().setTitle("📦 **PRODUCTS**").setFooter(team).setAuthor(product).addFields({
          name: "참여자",
          value: currentProduct.members.map(id => `<@!${id}>`).join(" ")
        }, {
          name: "진행 기간",
          value: `${currentProduct.from} ~ ${currentProduct.until}`
        }, {
          name: "정보",
          value: currentProduct.description
        })
      ],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("editProduct").setLabel("✏️EDIT").setStyle("PRIMARY"),
          new Discord.MessageButton().setCustomId("deleteProduct").setLabel("❌DELETE").setStyle("DANGER")
        ),
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageSelectMenu().setCustomId("productList").setPlaceholder(product).addOptions(Object.keys(teams[team].products).map((title) => ({
            label: title,
            value: title
          })))
        ),
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton().setCustomId("projects").setLabel("📝PROJECTS").setStyle("SECONDARY"),
          new Discord.MessageButton().setCustomId("community").setLabel("🌱COMMUNITY").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("finance").setLabel("🏦FINANCE").setStyle("SECONDARY").setDisabled(),
          new Discord.MessageButton().setCustomId("products").setLabel("📦PRODUCTS").setStyle("PRIMARY").setDisabled()
        )
      ]
    })).id;
    return true;
  }
}
Discord.User.prototype.product = Discord.GuildMember.prototype.product;

Discord.GuildMember.prototype.schedule = async function(team, project, currentDate) {
  if (!project) {
    this.project(team, project);
    return true;
  }
  let dateRange = [];
  for (let addDate = -10; addDate <= 10; addDate++) {
    dateRange.push(currentDate.add(addDate));
  }
  let memberTasks = {};
  for (let project2 in teams[team].projects) {
    for (let task of teams[team].projects[project2].tasks) {
      for (let member of task.members) {
        if (memberTasks[member]) {
          memberTasks[member].push(task);
        } else {
          memberTasks[member] = [task];
        }
      }
    }
  }
  if (!tabs[this.id][team]) {
    tabs[this.id][team] = {};
  }
  tabs[this.id][team].managerUI = (await this.send({
    embeds: [
      new Discord.MessageEmbed().setTitle("😃 **MEMBERS** (전체 프로젝트 기준)").setAuthor(project).setFooter(team).setDescription(`
${currentDate}
${(dateRange[0] <= today() && today() <= dateRange[20]) ? emojis.s8.repeat((today() - dateRange[0]) / 86400000) + "🔻" : emojis.s8.repeat(21)}
${dateRange.reduce((string, date) => string + emojis["d" + date.getDate()], "")}
      `).addFields(...Object.keys(memberTasks).map(worker => {
        memberTasks[worker].sort((prevTask, nextTask) => prevTask.from <= nextTask.from ? -1 : 1);
        const union = [{
          from: memberTasks[worker][0].from,
          until: memberTasks[worker][0].until,
          processSum: (((new Date(memberTasks[worker][0].until) - new Date(memberTasks[worker][0].from)) / 86400000) + 1) / 100 * memberTasks[worker][0].process
        }]
        for (let task of memberTasks[worker].slice(1)) {
          if (union[union.length - 1].until < new Date(task.from).add(-1).toString()) {
            union.push({
              from: task.from,
              until: task.until,
              processSum: (((new Date(task.until) - new Date(task.from)) / 86400000) + 1) / 100 * task.process
            });
          } else if (union[union.length - 1].until == new Date(task.from).add(-1).toString()) {
            union[union.length - 1].until = task.until;
            union[union.length - 1].processSum += (((new Date(task.until) - new Date(task.from)) / 86400000) + 1) / 100 * task.process;
          }
          if (task.until > union[union.length - 1].until) {
            union[union.length - 1].until = task.until;
            union[union.length - 1].processSum += (((new Date(task.until) - new Date(task.from)) / 86400000) + 1) / 100 * task.process;
          }
        }
        const progress = union.reduce((sum, bar) => sum + bar.processSum, 0) / union.reduce((sum, bar) => sum + ((new Date(bar.until) - new Date(bar.from)) / 86400000) + 1, 0) * 100;
        return {
          name: `${client.users.cache.get(worker)?.username} - ${Math.round(progress * 100) / 100}%`,
          value: dateRange.reduce((string, date) => {
            let resultChar = emojis.space;
            for (let bar of union) {
              if (date.add(1).toString() == bar.from) {
                return string + (resultChar == emojis.end ? emojis.startend : emojis.start);
              } else if (date.add(-1).toString() == bar.until) {
                resultChar = emojis.end;
              } else if (bar.from <= date.toString() && date.toString() <= bar.until) {
                if (((date - new Date(bar.from)) / 86400000 + 1) <= bar.processSum) {
                  return string + emojis.p8;
                } else if (((date - new Date(bar.from)) / 86400000) == Math.floor(bar.processSum)) {
                  return string + emojis["p" + Math.round(bar.processSum * 8 - ((date - new Date(bar.from)) / 86400000) * 8)];
                } else {
                  return string + emojis.p0;
                }
              }
            }
            return string + resultChar;
          }, "")
        }
      })),
      new Discord.MessageEmbed().setTitle("📅 **SCHEDULE**").setDescription(`
${(dateRange[0] <= today() && today() <= dateRange[20]) ? emojis.s8.repeat((today() - dateRange[0]) / 86400000) + "🔻" : emojis.s8.repeat(21)}
${dateRange.reduce((string, date) => string + emojis["d" + date.getDate()], "")}
      `).addFields(...teams[team].projects[project].tasks.map(task => {
        const progressPixel = Math.round(((new Date(task.until) - new Date(task.from)) / 86400000 + 1) * 8 / 100 * task.process);
        return {
          name: `${STATEEMOJI[task.state]} ${task.title} - _${task.process}%_`,
          value: "[" + dateRange.reduce((string, date) => {
            if (date.add(1).toString() == task.from) {
              return string + emojis.start
            } else if (date.add(-1).toString() == task.until) {
              return string + emojis.end
            } else if (task.from <= date.toString() && date.toString() <= task.until) {
              if (((date - new Date(task.from)) / 86400000 + 1) * 8 <= progressPixel) {
                return string + emojis[task.state[0] + 8];
              } else if (((date - new Date(task.from)) / 86400000) == Math.floor(progressPixel / 8)) {
                return string + emojis[task.state[0] + Math.round(progressPixel - ((date - new Date(task.from)) / 86400000) * 8)];
              } else {
                return string + emojis.p0;
              }
            } else {
              return string + emojis.space;
            }
          }, "") + `](${task.url[this.id]})`
        }
      }))
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setCustomId("previousSchedule2").setLabel("◀️◀️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("previousSchedule").setLabel("◀️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("addTask").setLabel("➕ADD").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("nextSchedule").setLabel("▶️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("nextSchedule2").setLabel("▶️▶️").setStyle("PRIMARY")
      ),
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu().setCustomId("projectList2").setPlaceholder(project).addOptions(Object.keys(teams[team].projects).map((title) => ({
          label: title,
          value: title
        })))
      ),
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setCustomId("projects").setLabel("📝PROJECTS").setStyle("SECONDARY"),
        new Discord.MessageButton().setCustomId("schedule").setLabel("🔄REFRESH").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("finance").setLabel("🏦FINANCE").setStyle("SECONDARY").setDisabled(),
        new Discord.MessageButton().setCustomId("products").setLabel("📦PRODUCTS").setStyle("SECONDARY")
      )
    ]
  })).id;
  return true;
}
Discord.User.prototype.schedule = Discord.GuildMember.prototype.schedule;

Discord.GuildMember.prototype.todo = async function(team, currentDate) {
  let dateRange = [];
  for (var addDate = -10; addDate <= 10; addDate++) {
    dateRange.push(currentDate.add(addDate));
  }
  const myTasks = [].concat(...Object.keys(teams[team].projects).map(project => teams[team].projects[project].tasks.filter(task => task.state != "finish" && task.members.includes(this.id)).map(task => ({
    ...task,
    project
  }))));
  if (!tabs[this.id][team]) {
    tabs[this.id][team] = {};
  }
  tabs[this.id][team].workerUI = (await this.send({
    embeds: [
      new Discord.MessageEmbed().setTitle("✅ **TODO**").setFooter(team).addFields(...myTasks.filter(task => task.from <= new Date().toString()).map(task => ({
        name: `${task.project} - ${task.title}`,
        value: `
${STATEEMOJI[task.state]} **${task.process}%**
*${task.from} ~ ${task.until}*
${task.description ?? "정보 없음"}
        `
      }))),
      new Discord.MessageEmbed().setTitle("🕒 **SCHEDULE**").setDescription(`
${currentDate}
${(dateRange[0] <= today() && today() <= dateRange[20]) ? emojis.s8.repeat((today() - dateRange[0]) / 86400000) + "🔻" : emojis.s8.repeat(21)}
${dateRange.reduce((string, date) => string + emojis["d" + date.getDate()], "")}
      `).addFields(...myTasks.map(task => {
        const progressPixel = Math.round(((new Date(task.until) - new Date(task.from)) / 86400000 + 1) * 8 / 100 * task.process);
        return {
          name: task.title,
          value: `[${dateRange.reduce((string, date) => {
          if (date.add(1).toString() == task.from) {
            return string + emojis.start;
          } else if (date.add(-1).toString() == task.until) {
            return string + emojis.end;
          } else if (task.from <= date.toString() && date.toString() <= task.until) {
            if (((date - new Date(task.from)) / 86400000 + 1) * 8 <= progressPixel) {
              return string + emojis[task.state[0] + 8];
            } else if (((date - new Date(task.from)) / 86400000) == Math.floor(progressPixel / 8)) {
              return string + emojis[task.state[0] + Math.round(progressPixel - ((date - new Date(task.from)) / 86400000) * 8)];
            } else {
              return string + emojis.p0;
            }
          } else {
            return string + emojis.space;
          }
        }, "")}](${(task.url2?.[this.id])})`
        }
      }))
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setCustomId("previousTODO2").setLabel("◀️◀️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("previousTODO").setLabel("◀️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("todayTODO").setLabel("○").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("nextTODO").setLabel("▶️").setStyle("PRIMARY"),
        new Discord.MessageButton().setCustomId("nextTODO2").setLabel("▶️▶️").setStyle("PRIMARY")
      ),
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setCustomId("todo").setLabel("✅TODO").setStyle("PRIMARY").setDisabled(),
        new Discord.MessageButton().setCustomId("tools").setLabel("🔧TOOLS").setStyle("SECONDARY").setDisabled(),
        new Discord.MessageButton().setCustomId("files").setLabel("📁FILES").setStyle("SECONDARY").setDisabled(),
        new Discord.MessageButton().setCustomId("community").setLabel("🌱COMMUNITY").setStyle("SECONDARY").setDisabled()
      )
    ]
  })).id;
  return true;
}
Discord.User.prototype.todo = Discord.GuildMember.prototype.todo;

client.on("interactionCreate", async interaction => {
  if (!interaction.message.deleted) {
    await interaction.message.delete();
  }
  const team = interaction.message.embeds[0].footer.text;
  const project = interaction.message.embeds[0].author?.name;
  if (!interaction.customId.startsWith(interactionToken)) {
    if (interaction.isSelectMenu()) {
      switch (interaction.customId) {
        case "projectList":
          interaction.user.project(team, interaction.values[0]);
          break;
        case "productList":
          interaction.user.product(team, interaction.values[0]);
          break;
        case "projectList2":
          interaction.user.schedule(team, interaction.values[0], today());
          break;
      }
    } else if (interaction.isButton()) {
      switch (interaction.customId) {
        case "projects":
          if (interaction.message.embeds[0].title.startsWith("😃")) {
            interaction.user.project(team, project);
          } else {
            interaction.user.project(team, Object.keys(teams[team].projects)[0]);
          }
          break;
        case "products":
          interaction.user.product(team, Object.keys(teams[team].products)[0]);
          break;
        case "schedule":
          interaction.user.schedule(team, project, today());
          break;
        case "addProject":
          await interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("➕ **Add Project**").setDescription(
                "프로젝트 제목을 입력해주세요.\n생성을 취소하고 싶으신 경우 **취소**라고 입력해주세요."
              ).setFooter(team)
            ]
          });
          title = (await interaction.channel.ask(m => m.author.id != "888657091093487648", 30000))?.replace("\n", "");
          await interaction.deleteReply();
          if (title == undefined || title.replace(" ", "") == "취소") {
            await interaction.user.project(team, project);
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("➕ **Add Project**").setDescription(
                "프로젝트 생성이 취소되었습니다."
              ).setFooter(team)
            );
          } else if (title in teams[team].projects || title in teams[team].products) {
            await interaction.user.project(team, project);
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("➕ **Add Project**").setDescription(
                "이미 존재하는 프로젝트명 또는 제품명입니다."
              ).setFooter(team)
            );
          } else {
            teams[team].projects[title] = {
              tasks: [],
              from: new Date().toString()
            };
            for (let manager of teams[team].managers) {
              if (!tabs[manager][team]) {
                tabs[manager][team] = {};
              }
              const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
              if (oldMessage) {
                if (oldMessage.embeds[0].title.startsWith("📝")) {
                  await oldMessage.delete();
                  await client.users.cache.get(manager).project(team, title);
                } else if (oldMessage.embeds[0].title.startsWith("📈")) {
                  await oldMessage.delete();
                  await client.users.cache.get(manager).project(team, oldMessage.embeds[0].author.name);
                } else if (oldMessage.embeds[0].title.startsWith("😃")) {
                  await oldMessage.delete();
                  await client.users.cache.get(manager).schedule(team, oldMessage.embeds[0].author.name, today());
                }
              }
            }
            await interaction.user.project(team, title);
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("➕ **Add Project**").setDescription(
                "프로젝트가 성공적으로 생성되었습니다."
              ).setFooter(team).setAuthor(title)
            );
          }
          break;
        case "deleteProject":
          interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("❌ **Delete Project**").setDescription(
                "프로젝트를 정말로 삭제하시겠습니까?"
              ).setAuthor(project).setFooter(team)
            ],
            components: [
              new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(interactionToken + "deleteProjectO").setLabel("❌DELETE").setStyle("DANGER"),
                new Discord.MessageButton().setCustomId(interactionToken + "deleteProjectX").setLabel("🚫CANCEL").setStyle("SECONDARY")
              )
            ]
          });
          break;
        case "finishProject":
          interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("✅ **Finish Project**").setDescription(
                "프로젝트 정보를 입력해주세요.\n등록을 취소하고 싶으신 경우 **취소**라고 입력해주세요."
              ).setFooter(team).setAuthor(project)
            ]
          });
          description = (await interaction.channel.ask(m => m.author.id != "888657091093487648", 180000));
          await interaction.deleteReply();
          if (description == undefined || description.replace(" ", "") == "취소") {
            await interaction.user.project(team, project);
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("✅ **Finish Project**").setDescription(
                "프로젝트 등록이 취소되었습니다."
              ).setFooter(team).setAuthor(project)
            );
          } else {
            interaction.followUp({
              embeds: [
                new Discord.MessageEmbed().setTitle("✅ **Finish Project**").setDescription(
                  "프로젝트를 정말로 등록하시겠습니까?"
                ).setAuthor(project).setFooter(team).addFields({
                  name: "프로젝트 정보",
                  value: description
                })
              ],
              components: [
                new Discord.MessageActionRow().addComponents(
                  new Discord.MessageButton().setCustomId(interactionToken + "finishProjectO").setLabel("✅FINISH").setStyle("SUCCESS"),
                  new Discord.MessageButton().setCustomId(interactionToken + "finishProjectX").setLabel("🚫CANCEL").setStyle("SECONDARY")
                )
              ]
            });
          }
          break;
        case "editProduct":
          interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("✏️ **Edit Product**").setDescription(
                "제품 정보를 입력해주세요.\n수정을 취소하고 싶으신 경우 **취소**라고 입력해주세요."
              ).setFooter(team).setAuthor(project)
            ]
          });
          description = (await interaction.channel.ask(m => m.author.id != "888657091093487648", 180000));
          await interaction.deleteReply();
          if (description == undefined || description.replace(" ", "") == "취소") {
            await interaction.user.product(team, project);
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("✏️ **Edit Product**").setDescription(
                "제품 정보 수정이 취소되었습니다."
              ).setFooter(team).setAuthor(project)
            );
          } else {
            teams[team].products[project].description = description;
            await interaction.user.product(team, project);
            for (let manager of teams[team].managers) {
              if (!tabs[manager][team]) {
                tabs[manager][team] = {};
              }
              const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
              if (oldMessage && oldMessage.embeds[0].title.startsWith("📦") && oldMessage.embeds[0].author.name == project) {
                await oldMessage.delete();
                await client.users.cache.get(manager).product(team, project);
              }
            }
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("✏️ **Edit Product**").setDescription(
                "제품 정보가 수정되었습니다."
              ).setFooter(team).setAuthor(project)
            );
          }
          break;
        case "deleteProduct":
          interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("❌ **Delete Product**").setDescription(
                "제품을 정말로 삭제하시겠습니까?"
              ).setAuthor(project).setFooter(team)
            ],
            components: [
              new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton().setCustomId(interactionToken + "deleteProductO").setLabel("❌DELETE").setStyle("DANGER"),
                new Discord.MessageButton().setCustomId(interactionToken + "deleteProductX").setLabel("🚫CANCEL").setStyle("SECONDARY")
              )
            ]
          });
          break;
        case "previousSchedule2":
          interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]).add(-7));
          break;
        case "previousSchedule":
          interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]).add(-1));
          break;
        case "nextSchedule":
          interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]).add(1));
          break;
        case "nextSchedule2":
          interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]).add(7));
          break;
        case "addTask":
          await interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                "업무 제목을 입력해주세요.\n생성을 취소하고 싶으신 경우 **취소**라고 입력해주세요."
              ).setFooter(team)
            ]
          });
          title = (await interaction.channel.ask(m => m.author.id != "888657091093487648", 30000))?.replace("\n", "");
          await interaction.deleteReply();
          if (title == undefined || title.replace(" ", "") == "취소") {
            await interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]));
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                "업무 생성이 취소되었습니다."
              ).setFooter(team)
            );
          } else {
            const descriptionMessage = await interaction.followUp({
              embeds: [
                new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                  "업무 정보를 입력해주세요.\n생성을 취소하고 싶으신 경우 **취소**라고 입력해주세요."
                ).setFooter(team).addFields({
                  name: "제목",
                  value: title
                })
              ]
            });
            const description = (await interaction.channel.ask(m => m.author.id != "888657091093487648", 300000))?.replace("\n", "");
            await descriptionMessage.delete();
            if (description == undefined || description.replace(" ", "") == "취소") {
              await interaction.user.schedule(team, project, new Date(interaction.message.embeds[0].description.split("\n")[0]));
              interaction.channel.notice(
                new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                  "업무 생성이 취소되었습니다."
                ).setFooter(team)
              );
            } else {
              interaction.followUp({
                embeds: [
                  new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                    "업무 담당자를 선택해주세요."
                  ).setAuthor(project).setFooter(team).addFields({
                    name: "제목",
                    value: title
                  }, {
                    name: "정보",
                    value: description
                  })
                ],
                components: [
                  new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(interactionToken + "workerList").setPlaceholder("담당자 선택 (복수 선택 가능)").addOptions(...teams[team].workers.filter(worker => client.users.cache.get(worker) != undefined).map(worker => ({
                      label: client.users.cache.get(worker).username,
                      value: worker
                    }))).setMaxValues(teams[team].workers.filter(worker => client.users.cache.get(worker) != undefined).length)
                  )
                ]
              });
            }
          }
          break;
        case "previousTODO2":
          interaction.user.todo(team, new Date(interaction.message.embeds[1].description.split("\n")[0]).add(-7));
          break;
        case "previousTODO":
          interaction.user.todo(team, new Date(interaction.message.embeds[1].description.split("\n")[0]).add(-1));
          break;
        case "todayTODO":
          interaction.user.todo(team, today());
          break;
        case "nextTODO":
          interaction.user.todo(team, new Date(interaction.message.embeds[1].description.split("\n")[0]).add(1));
          break;
        case "nextTODO2":
          interaction.user.todo(team, new Date(interaction.message.embeds[1].description.split("\n")[0]).add(7));
          break;
      }
    }
  } else {
    if (interaction.isSelectMenu()) {
      switch (interaction.customId.slice(interactionToken.length)) {
        case "workerList":
          interaction.reply({
            embeds: [
              new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(`
업무 시작일을 입력해주세요.
예) ${new Date().toString()}
생성을 취소하고 싶으신 경우 **취소**라고 입력해주세요.
              `).setAuthor(project).setFooter(team).addFields({
                name: "제목",
                value: interaction.message.embeds[0].fields[0].value
              }, {
                name: "정보",
                value: interaction.message.embeds[0].fields[1].value
              }, {
                name: "담당자",
                value: interaction.values.reduce((string, worker) => string + `<@!${worker}>` + "\n", "")
              })
            ]
          });
          const fromDate = (await interaction.channel.ask(m => m.author.id != "888657091093487648" && ((!isNaN(new Date(m.content).valueOf()) && today() <= new Date(m.content)) || m.content.replace(" ", "").replace("\n", "") == "취소"), 300000))?.replace("\n", "");
          await interaction.deleteReply();
          if (fromDate == undefined || fromDate.replace(" ", "") == "취소") {
            await interaction.user.schedule(team, project, today());
            interaction.channel.notice(
              new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                "업무 생성이 취소되었습니다."
              ).setFooter(team)
            );
          } else {
            const untilMessage = await interaction.followUp({
              embeds: [
                new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(`
업무 마감일을 입력해주세요.
예) ${new Date().toString()}
생성을 취소하고 싶으신 경우 **취소**라고 입력해주세요.
                `).setAuthor(project).setFooter(team).addFields({
                  name: "제목",
                  value: interaction.message.embeds[0].fields[0].value
                }, {
                  name: "정보",
                  value: interaction.message.embeds[0].fields[1].value
                }, {
                  name: "담당자",
                  value: interaction.values.reduce((string, worker) => string + `<@!${worker}>` + "\n", "")
                }, {
                  name: "시작일",
                  value: new Date(fromDate).toString()
                })
              ]
            });
            const untilDate = (await interaction.channel.ask(m => m.author.id != "888657091093487648" && ((!isNaN(new Date(m.content).valueOf()) && new Date(fromDate) <= new Date(m.content)) || m.content.replace(" ", "").replace("\n", "") == "취소"), 300000))?.replace("\n", "");
            await untilMessage.delete();
            if (untilDate == undefined || untilDate.replace(" ", "") == "취소") {
              await interaction.user.schedule(team, project, today());
              interaction.channel.notice(
                new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                  "업무 생성이 취소되었습니다."
                ).setFooter(team)
              );
            } else {
              const memberString = interaction.values.reduce((string, worker) => string + `<@!${worker}>` + "\n", "");
              teams[team].projects[project].tasks.push({
                "title": interaction.message.embeds[0].fields[0].value,
                "members": interaction.values,
                "from": new Date(fromDate).toString(),
                "until": new Date(untilDate).toString(),
                "process": 0,
                "state": "progress",
                "url": {},
                "url2": {},
                "id": {},
                "id2": {}
              });
              for (let manager of teams[team].managers) {
                const reportMessage = await client.users.cache.get(manager)?.send({
                  embeds: [
                    new Discord.MessageEmbed().setTitle("📢 **Task Report**").setAuthor(project).setFooter(team).addFields({
                      name: "업무",
                      value: interaction.message.embeds[0].fields[0].value
                    }, {
                      name: "담당자",
                      value: memberString
                    }, {
                      name: "보고사항",
                      value: "아직까지 전송받은 보고사항이 없습니다."
                    })
                  ]
                });
                if (reportMessage != undefined && (reportMessage instanceof Discord.Message)) {
                  teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].url[manager] = reportMessage.url;
                  teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].id[manager] = reportMessage.id;
                }
                if (!tabs[manager][team]) {
                  tabs[manager][team] = {};
                }
                const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
                if (oldMessage) {
                  if (oldMessage.embeds[0].title.startsWith("😃")) {
                    await oldMessage.delete();
                    await client.users.cache.get(manager).schedule(team, oldMessage.embeds[0].author.name, today());
                  } else if (oldMessage.embeds[0].title.startsWith("📈") && oldMessage.embeds[0].author.name == project) {
                    await oldMessage.delete();
                    await client.users.cache.get(manager).project(team, project);
                  }
                }
              }
              for (let worker of interaction.values) {
                const orderMessage = await client.users.cache.get(worker)?.send({
                  embeds: [
                    new Discord.MessageEmbed().setTitle("📞 **Task Order**").setAuthor(project).setFooter(team).addFields({
                      name: "업무",
                      value: interaction.message.embeds[0].fields[0].value
                    }, {
                      name: "담당자",
                      value: memberString
                    }, {
                      name: "시작일",
                      value: new Date(fromDate).toString()
                    }, {
                      name: "마감일",
                      value: new Date(untilDate).toString()
                    }, {
                      name: "정보",
                      value: interaction.message.embeds[0].fields[1].value
                    })
                  ]
                });
                if (orderMessage != undefined && (orderMessage instanceof Discord.Message)) {
                  teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].url2[worker] = orderMessage.url;
                  teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].id2[worker] = orderMessage.id;
                }
                if (!tabs[worker][team]) {
                  tabs[worker][team] = {};
                }
                const oldMessage = await (channels.find(ch => ch.recipient.id == worker).messages.fetch(tabs[worker][team].workerUI));
                if (oldMessage && oldMessage.embeds[0].title.startsWith("✅")) {
                  await oldMessage.delete();
                  await client.users.cache.get(worker).todo(team, today());
                }
              }
              await interaction.user.schedule(team, project, today());
              interaction.channel.notice(
                new Discord.MessageEmbed().setTitle("➕ **Add Task**").setDescription(
                  "업무가 성공적으로 생성되었습니다."
                ).setFooter(team)
              );
            }
          }
          break;
      }
    } else if (interaction.isButton()) {
      switch (interaction.customId.slice(interactionToken.length)) {
        case "deleteProjectO":
          delete teams[team].projects[project];
          for (let manager of teams[team].managers) {
            if (!tabs[manager][team]) {
              tabs[manager][team] = {};
            }
            const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
            if (oldMessage) {
              if (oldMessage.embeds[0].title.startsWith("📈")) {
                await oldMessage.delete();
                if (oldMessage.embeds[0].author.name == project) {
                  await client.users.cache.get(manager).project(team, Object.keys(teams[team].projects)[0]);
                } else {
                  await client.users.cache.get(manager).project(team, oldMessage.embeds[0].author.name);
                }
              } else if (oldMessage.embeds[0].title.startsWith("😃")) {
                await oldMessage.delete();
                if (oldMessage.embeds[0].author.name == project) {
                  await client.users.cache.get(manager).schedule(team, Object.keys(teams[team].projects)[0], today());
                } else {
                  await client.users.cache.get(manager).schedule(team, oldMessage.embeds[0].author.name, today());
                }
              }
            }
          }
          for (let worker of teams[team].workers) {
            if (!tabs[worker][team]) {
              tabs[worker][team] = {};
            }
            const oldMessage = await (channels.find(ch => ch.recipient.id == worker).messages.fetch(tabs[worker][team].workerUI));
            if (oldMessage && oldMessage.embeds[0].title.startsWith("✅") && oldMessage.embeds[0].fields.some(field => field.name.includes(project))) {
              await oldMessage.delete();
              await client.users.cache.get(manager).todo(team, today());
            }
          }
          await interaction.user.project(team, Object.keys(teams[team].projects)[0]);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("❌ **Delete Project**").setDescription(
              "프로젝트가 삭제되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
        case "deleteProjectX":
          await interaction.user.project(team, project);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("❌ **Delete Project**").setDescription(
              "프로젝트 삭제가 취소되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
        case "finishProjectO":
          teams[team].products[project] = {
            members: [...new Set(teams[team].managers.concat(...teams[team].projects[project].tasks.map(task => task.members)))],
            from: teams[team].projects[project].from,
            until: new Date().toString(),
            description: interaction.message.embeds[0].fields[0].value,
            state: "private"
          };
          delete teams[team].projects[project];
          for (let manager of teams[team].managers) {
            if (!tabs[manager][team]) {
              tabs[manager][team] = {};
            }
            const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
            if (oldMessage) {
              if (oldMessage.embeds[0].title.startsWith("📈")) {
                await oldMessage.delete();
                if (oldMessage.embeds[0].author.name == project) {
                  await client.users.cache.get(manager).project(team, Object.keys(teams[team].projects)[0]);
                } else {
                  await client.users.cache.get(manager).project(team, oldMessage.embeds[0].author.name);
                }
              } else if (oldMessage.embeds[0].title.startsWith("📦")) {
                await oldMessage.delete();
                await client.users.cache.get(manager).product(team, oldMessage.embeds[0].author.name);
              } else if (oldMessage.embeds[0].title.startsWith("😃")) {
                await oldMessage.delete();
                if (oldMessage.embeds[0].author.name == project) {
                  await client.users.cache.get(manager).schedule(team, Object.keys(teams[team].projects)[0], today());
                } else {
                  await client.users.cache.get(manager).schedule(team, oldMessage.embeds[0].author.name, today());
                }
              }
            }
          }
          for (let worker of teams[team].workers) {
            if (!tabs[worker][team]) {
              tabs[worker][team] = {};
            }
            const oldMessage = await (channels.find(ch => ch.recipient.id == worker).messages.fetch(tabs[worker][team].workerUI));
            if (oldMessage && oldMessage.embeds[0].title.startsWith("✅") && oldMessage.embeds[0].fields.some(field => field.name.includes(project))) {
              await oldMessage.delete();
              await client.users.cache.get(manager).todo(team, today());
            }
          }
          await interaction.user.product(team, project);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("✅ **Finish Project**").setDescription(
              "프로젝트가 등록되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
        case "finishProjectX":
          await interaction.user.project(team, project);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("✅ **Finish Project**").setDescription(
              "프로젝트 등록이 취소되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
        case "deleteProductO":
          delete teams[team].products[project];
          for (let manager of teams[team].managers) {
            if (!tabs[manager][team]) {
              tabs[manager][team] = {};
            }
            const oldMessage = await (channels.find(ch => ch.recipient.id == manager).messages.fetch(tabs[manager][team].managerUI));
            if (oldMessage && oldMessage.embeds[0].title.startsWith("📦")) {
              await oldMessage.delete();
              if (oldMessage.embeds[0].author.name == project) {
                await client.users.cache.get(manager).product(team, Object.keys(teams[team].products)[0]);
              } else {
                await client.users.cache.get(manager).product(team, oldMessage.embeds[0].author.name);
              }
            }
          }
          await interaction.user.product(team, Object.keys(teams[team].products)[0]);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("❌ **Delete Product**").setDescription(
              "제품이 삭제되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
        case "deleteProductX":
          await interaction.user.product(team, project);
          interaction.channel.notice(
            new Discord.MessageEmbed().setTitle("❌ **Delete Product**").setDescription(
              "제품 삭제가 취소되었습니다."
            ).setFooter(team).setAuthor(project)
          );
          break;
      }
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.type == "DM" && message.author.id != "888657091093487648" && message.type == "REPLY") {
    const replied = await message.channel.messages.fetch(message.reference.messageId);
    if (replied && replied.embeds) {
      const team = replied.embeds[0].footer.text;
      const project = replied.embeds[0].author.name;
      if (replied.embeds[0].title.startsWith("📢")) {
        const currentTask = teams[team].projects[project].tasks.find(task => task.id[message.author.id] == replied.id);
        currentTask.description = message.content;
        for (let worker of currentTask.members) {
          const orderMessage = await client.users.cache.get(worker)?.send({
            embeds: [
              new Discord.MessageEmbed().setTitle("📞 **Task Order**").setAuthor(project).setFooter(team).addFields({
                name: "업무",
                value: currentTask.title
              }, {
                name: "담당자",
                value: currentTask.members.reduce((string, task) => string + `<@!${task}> `, "")
              }, {
                name: "시작일",
                value: currentTask.from
              }, {
                name: "마감일",
                value: currentTask.until
              }, {
                name: "정보",
                value: message.content
              }).setDescription(`[⏮️](${currentTask.url2[message.author.id]})`)
            ]
          });
          if (orderMessage != undefined && (orderMessage instanceof Discord.Message)) {
            const oldMessage = await orderMessage.channel.messages.fetch(currentTask.id2[message.author.id]);
            oldMessage?.edit({
              embeds: [
                oldMessage.embeds[0].setDescription((oldMessage.embeds[0].description ? oldMessage.embeds[0].description + emojis.s8 : "") + `[⏭️](${orderMessage.url})`)
              ]
            });
            teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].url2[worker] = orderMessage.url;
            teams[team].projects[project].tasks[teams[team].projects[project].tasks.length - 1].id2[worker] = orderMessage.id;
          }
        }
      }
    }
  } else if (message.content.startsWith("!")) {
    switch (message.content.slice(1)) {
      case "setup":
        message.author.project("ALPHA", "대충 존나 쩌는 게임");
        break;
      case "setup2":
        message.author.todo("ALPHA", today());
        break;
    }
  }
});

const process = {
  env: require("./config.json")
}
client.login(process.env.DISCORD);

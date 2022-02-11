require("dotenv").config();
const BuildDir = process.cwd() + "/build";
// @ts-ignore
import type { ILoggingTypes } from "@cpg/Interfaces/Logging.interface";
// @ts-ignore
import type mainEvent from "@cpg/Events/Main.event";
import config from "../config.json";
import { WebhookClient } from "discord.js";
const discord_webhook_url = process.env.DISCORD_WEBHOOK_URL ?? "";

// Change name of the class.
export = async function main()
{
    const Logger = (await import(`${BuildDir}/lib/Logger`)).default as ILoggingTypes;
    const MainEvent = (await import(`${BuildDir}/Events/Main.event`)).default as typeof mainEvent;

    if(!discord_webhook_url)
        return Logger.plugin("Discord webhook url not set");

    sendWebhook("cpg-plugin-discord-webhook loaded", {
        text: "cpg-plugin-discord-webhook loaded",
    });

    Logger.info(`Starting ${config.name} plugin with version ${config.version}.`);

    MainEvent.on("invoice_paid", invoice => {
        sendWebhook("Invoice paid", {
            text: `Invoice \`id #${invoice.id}\` has been paid.`,
        })
    });

    MainEvent.on("invoice_created", invoice => {
        sendWebhook("Invoice created", {
            text: `Invoice \`id #${invoice.id}\` has been created.`,
        })
    });

    MainEvent.on("invoice_deleted", invoice => {
        sendWebhook("Invoice created", {
            text: `Invoice \`id #${invoice.id}\` has been deleted.`,
        })
    });

    MainEvent.on("invoice_updated", invoice => {
        sendWebhook("Invoice updated", {
            text: `Invoice \`id #${invoice.id}\` has been updated.`,
        })
    });

    MainEvent.on("invoice_notified", invoice => {
        sendWebhook("Invoice notified", {
            text: `Invoice \`id #${invoice.id}\` has been notified.`,
        })
    });

    MainEvent.on("order_created", order => {
        sendWebhook("order created", {
            text: `Order \`id #${order.id}\` has been created.`,
        })
    });

    MainEvent.on("order_deleted", order => {
        sendWebhook("order created", {
            text: `Order \`id #${order.id}\` has been deleted.`,
        })
    });

    MainEvent.on("order_updated", order => {
        sendWebhook("order updated", {
            text: `Order \`id #${order.id}\` has been updated.`,
        })
    });
}

function getToken(url: string) 
{
    let removeURL = url.replace('https://discord.com/api/webhooks/', '');
    let parser = removeURL.split(/\//g);
    let token = parser[1];
  
    return token;
}

function getID(url: string) 
{
    let removeURL = url.replace('https://discord.com/api/webhooks/', '');
    let parser = removeURL.split(/\//g);
    let ID = parser[0];
  
    return ID;
}

/**
 * 
 * @param {String} title 
 * @param {{
 * embeds?: MessageEmbed[],
 * text?: String,
 * }} data 
 */
function sendWebhook(title: string, data: any)
{
    const webhookClient = new WebhookClient(getID(discord_webhook_url), getToken(discord_webhook_url));

    let d = {
        title: title,
        content: '',
        embeds: [],
    }

    if(data.text)
        d.content = data.text;

    if(data.embeds)
        d.embeds = data.embeds;

    webhookClient.send(d);
}
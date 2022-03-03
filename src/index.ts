require("dotenv").config();
const BuildDir = process.cwd() + "/build";
// @ts-ignore
import type { ILoggingTypes } from "@cpg/Interfaces/Logging.interface";
// @ts-ignore
import type mainEvent from "@cpg/Events/Main.event";
// @ts-ignore
import type TcreatePDFInvoice from "@cpg/Lib/Invoices/CreatePDFInvoice";
import config from "../config.json";
import { WebhookClient, MessageEmbed, MessageAttachment } from "discord.js";
const discord_webhook_url = process.env.DISCORD_WEBHOOK_URL ?? "";

// Change name of the class.
export = async function main()
{
    const Logger = (await import(`${BuildDir}/Lib/Logger`)).default as ILoggingTypes;
    const MainEvent = (await import(`${BuildDir}/Events/Main.event`)).default as typeof mainEvent;
    const createPDFInvoice = (await import(`${BuildDir}/Lib/Invoices/CreatePDFInvoice`)).default as typeof TcreatePDFInvoice;

    if(!discord_webhook_url)
        return Logger.plugin("Discord webhook url not set");

    sendWebhook("cpg-plugin-discord-webhook loaded", {
        text: "cpg-plugin-discord-webhook loaded",
    });

    Logger.info(`Starting ${config.name} plugin with version ${config.version}.`);

    MainEvent.on("invoice_paid", async invoice => {
        let pdf = await createPDFInvoice(invoice);
        let buffer = Buffer.from(pdf, "base64");
        let attachment = new MessageAttachment(buffer, `invoice_${invoice.id}.pdf`);
        const embed = new MessageEmbed()
            .setTitle("Invoice notified")
            .setDescription(`Invoice \`id #${invoice.id}\` has been paid.`)
            .setColor("#0099ff")
            .attachFiles([attachment])
            .setTimestamp();
        sendWebhook("Invoice paid", {
            text: `Invoice \`id #${invoice.id}\` has been paid.`,
            embeds: [embed],
        })
    });

    MainEvent.on("invoice_created", async invoice => {
        let pdf = await createPDFInvoice(invoice);
        let buffer = Buffer.from(pdf, "base64");
        let attachment = new MessageAttachment(buffer, `invoice_${invoice.id}.pdf`);
        const embed = new MessageEmbed()
            .setTitle("Invoice notified")
            .setDescription(`Invoice \`id #${invoice.id}\` has been created.`)
            .setColor("#0099ff")
            .attachFiles([attachment])
            .setTimestamp();
        sendWebhook("Invoice created", {
            text: `Invoice \`id #${invoice.id}\` has been created.`,
            embeds: [embed],
        })
    });

    MainEvent.on("invoice_deleted", async invoice => {
        let pdf = await createPDFInvoice(invoice);
        let buffer = Buffer.from(pdf, "base64");
        let attachment = new MessageAttachment(buffer, `invoice_${invoice.id}.pdf`);
        const embed = new MessageEmbed()
            .setTitle("Invoice notified")
            .setDescription(`Invoice \`id #${invoice.id}\` has been deleted.`)
            .setColor("#0099ff")
            .attachFiles([attachment])
            .setTimestamp();
        sendWebhook("Invoice created", {
            text: `Invoice \`id #${invoice.id}\` has been deleted.`,
            embeds: [embed],
        })
    });

    MainEvent.on("invoice_updated", async invoice => {
        let pdf = await createPDFInvoice(invoice);
        let buffer = Buffer.from(pdf, "base64");
        let attachment = new MessageAttachment(buffer, `invoice_${invoice.id}.pdf`);
        const embed = new MessageEmbed()
            .setTitle("Invoice notified")
            .setDescription(`Invoice \`id #${invoice.id}\` has been updated.`)
            .setColor("#0099ff")
            .attachFiles([attachment])
            .setTimestamp();
        sendWebhook("Invoice updated", {
            text: `Invoice \`id #${invoice.id}\` has been updated.`,
            embeds: [embed],
        })
    });

    MainEvent.on("invoice_notified", async invoice => {
        let pdf = await createPDFInvoice(invoice);
        let buffer = Buffer.from(pdf, "base64");
        let attachment = new MessageAttachment(buffer, `invoice_${invoice.id}.pdf`);
        const embed = new MessageEmbed()
            .setTitle("Invoice notified")
            .setDescription(`Invoice \`id #${invoice.id}\` has been notified.`)
            .setColor("#0099ff")
            .attachFiles([attachment])
            .setTimestamp();
        sendWebhook("Invoice notified", {
            text: `Invoice \`id #${invoice.id}\` has been notified.`,
            embeds: [embed],
        });
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
function sendWebhook(title: string, data: {
    embeds?: MessageEmbed[],
    text?: string,
})
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
        // @ts-ignore
        d.embeds = data.embeds;

    webhookClient.send(d);
}
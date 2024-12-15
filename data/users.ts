"use server";
import pool from "@/data/database";
import { generateHash, verify } from "@/data/passwords";
import { generate } from "@/data/model";

export async function createUser(email: string, password: string, firstName: string, lastName: string, birthdate: string): Promise<number> {
    let passwordHash = await generateHash(password);
    let [result]: any = await pool.query("INSERT INTO users (creation_date, email_address, password_hash, first_name, last_name, birth_date) VALUES ((SELECT NOW()), ?, ?, ?, ?, ?)", [email, passwordHash, firstName, lastName, birthdate]);
    
    return result.insertId ?? 0;
}

export async function updateUser(userid: number, firstName: string, lastName: string, location: string, birthDate: Date, gender: string, occupation: string, emailAddress: string): Promise<boolean> {
    let [result]: any = await pool.query("UPDATE users SET first_name = ?, last_name = ?, location = ?, birth_date = ?, gender = ?, occupation = ?, email_address = ? WHERE user_id = ?", [firstName, lastName, location, birthDate, gender, occupation, emailAddress, userid]);
    return result.affectedRows > 0;
}

export async function updateSettings(userid: number, theme: string, model: string, summaryStyle: string, chatStyle: string): Promise<boolean> {
    let [result]: any = await pool.query("UPDATE settings theme = ?, model = ?, summary_style = ?, chat_style = ? WHERE user_id = ?", [theme, model, summaryStyle, chatStyle, userid]);
    return result.affectedRows > 0;
}

export async function deleteUser(userid: number): Promise<boolean> {
    let [result]: any = await pool.query("UPDATE users SET deleted = 1 WHERE user_id = ?", [userid]);
    return result.affectedRows > 0;
}

export async function getUserByID(userid: number): Promise<any> {
	let [result]: any = await pool.query("SELECT users.user_id, creation_date, first_name, last_name, birth_date, settings.model FROM users INNER JOIN settings ON settings.user_id = users.user_id WHERE users.user_id = ? AND deleted = 0", [userid]);
	return result[0];
}

export async function getUserDetails(userid: number): Promise<any> {
    let [result]: any = await pool.query("SELECT user_id, creation_date, email_address, first_name, last_name, CAST(birth_date AS CHAR) AS birth_date, gender, occupation, location FROM users WHERE user_id = ? AND deleted = 0", [userid]);
    return result[0];
}

export async function getUserSettings(userid: number): Promise<any> {
    let [result]: any = await pool.query("SELECT * FROM settings WHERE user_id = ?", [userid]);
    return result[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    let [result]: any = await pool.query("SELECT user_id, first_name, last_name, birth_date FROM users WHERE email_address = ? AND deleted = 0", [email]);
    return result[0];
}

export async function getPasswordHash(identifier: string | number): Promise<string> {
	let field = typeof identifier == "number" ? "user_id" : "email_address";
    
	let [result]: any = await pool.query(`SELECT password_hash AS \`password\` FROM users WHERE ${field} = ?`, [identifier]);

	return result[0]?.password;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
	let hash = await getPasswordHash(email);

	if (!hash?.length) return false;

	let valid = await verify(password, hash);
	return valid;
}

export async function emailExists(email: string): Promise<boolean> {
	let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users WHERE email_address = ?", [email]);
	return result[0].total;
}

export async function getSearchHistory(userid: number, limit: number): Promise<any[]> {
    let [result]: any = await pool.query("SELECT * FROM searches WHERE user_id = ? ORDER BY search_date DESC LIMIT ?", [userid, limit]);
    return result;
}

export async function insertSearchHistory(userid: number, query: string): Promise<boolean> {
    let [result]: any = await pool.query("INSERT INTO searches (user_id, search_date, query) VALUES (?, NOW(), ?)", [userid, query]);
    return result.affectedRows > 0;
}

export async function recordConversation(userid: number, messages: any): Promise<number> {
    try {
        let summary = await generate({
            model: "deepseek-v2:lite",
            prompt: `Summarise the following text into a sentence without a period at the end and no longer than 5 words: ${messages[0].content}`
        }) ?? "Unknown Chat";

        let [result]: any = await pool.query("INSERT INTO conversations (user_id, start_date, summary, messages) VALUES (?, NOW(), ?, ?)", [userid, summary, JSON.stringify(messages)]);
        return result.insertId ?? 0;
    } catch (ex: any) {
        console.error(ex);
        return 0;
    }
}

export async function updateConversation(conversationid: number, messages: any): Promise<boolean> {
    try {
        let [result]: any = await pool.query("UPDATE conversations SET messages = ? WHERE conversation_id = ?", [JSON.stringify(messages), conversationid]);
        return result.affectedRows > 0;
    } catch (ex: any) {
        console.error(ex);
        return false;
    }
}

export async function getConversationHistory(userid: number): Promise<any[]> {
    let [result]: any = await pool.query("SELECT * FROM conversations WHERE user_id = ? ORDER BY start_date DESC", [userid]);
    return result;
}
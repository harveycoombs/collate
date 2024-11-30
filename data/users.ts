"use server";
import pool from "@/data/database";
import { verify } from "@/data/passwords";

export async function getUserByID(userid: number): Promise<any> {
	let [result]: any = await pool.query("SELECT user_id, creation_date, first_name, last_name, location FROM users WHERE user_id= ? AND deleted = 0", [userid]);
	return result[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    let [result]: any = await pool.query("SELECT user_id, first_name, last_name, location FROM users WHERE email_address= ? AND deleted = 0", [email]);
    return result[0];
}

export async function getPasswordHash(identifier: string | number): Promise<string> {
	let field = typeof identifier == "number" ? "user_id" : "email_address";

	let [result]: any = await pool.query(`SELECT password_hash FROM users WHERE ${field} = ?`, [identifier]);

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
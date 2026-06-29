import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { Capacitor } from "@capacitor/core";

const MANIFEST_URL = "https://bolao-da-copa.vercel.app/manifest.json";

let currentVersion = "1.0.0";

export function setCurrentVersion(version) {
  currentVersion = version;
}

export function getCurrentVersion() {
  return currentVersion;
}

export async function checkForUpdates() {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const syncResult = await LiveUpdate.sync({
      url: MANIFEST_URL,
    });

    return syncResult;
  } catch (error) {
    console.log("Nenhuma atualizacao disponivel:", error.message);
    return null;
  }
}

export async function applyUpdate() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await LiveUpdate.reload();
  } catch (error) {
    console.error("Erro ao aplicar update:", error);
  }
}

export async function getUpdateStatus() {
  if (!Capacitor.isNativePlatform()) return null;

  try {
    const status = await LiveUpdate.getChannel();
    return status;
  } catch (error) {
    return null;
  }
}

import { platformToolList } from "@/lib/platformTools/platformToolsList"
import { platformToolDefinitionById } from "@/lib/platformTools/utils/platformToolsUtils"
import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert } from "@/supabase/types"

export const getAssistantToolsByAssistantId = async (assistantId: string) => {
  const { data: assistantTools, error } = await supabase
    .from("assistants")
    .select(
      `
        id, 
        name, 
        tools (*),
        assistant_platform_tools (*)
      `
    )
    .eq("id", assistantId)
    .single()

  if (!assistantTools) {
    throw new Error(error.message)
  }
  
   const platformTools = assistantTools.assistant_platform_tools.map(tool =>
    platformToolDefinitionById(tool.tool_id)
  )

  const allAssistantTools = (assistantTools.tools || []).concat(
    platformTools || []
  )

  return {
    tools: allAssistantTools,
    id: assistantTools.id,
    name: assistantTools.name
  }
}
  
 async function insertTools(
  tableName: string,
  tools: TablesInsert<"assistant_tools">[] | TablesInsert<"assistant_tools">
) {
  const { data, error } = await supabase
    .from(tableName)
    .insert(tools)
    .select("*")

  if (!data) {
    throw new Error(error.message)
  }

  return data
}

async function handleToolInsertion(assistantTools: any, tableName: string) {
  const isPlatformTool = (tool: any) =>
    platformToolList.some(ptool => ptool.id === tool.tool_id)
  const filteredTools = assistantTools.filter(isPlatformTool)
  return await insertTools(tableName, filteredTools)
}

export const createAssistantTool = async (
  assistantTool: TablesInsert<"assistant_tools">
) => {
  const { data: createdAssistantTool, error } = await supabase
    .from("assistant_tools")
    .insert(assistantTool)
    .select("*")

  if (!createdAssistantTool) {
    throw new Error(error.message)
  }

  return createdAssistantTool
}

export const createAssistantTools = async (
  assistantTools: TablesInsert<"assistant_tools">[]
) => {
  const { data: createdAssistantTools, error } = await supabase
    .from("assistant_tools")
    .insert(assistantTools)
    .select("*")

  if (!createdAssistantTools) {
    throw new Error(error.message)
  }

  return createdAssistantTools
}

export const deleteAssistantTool = async (
  assistantId: string,
  toolId: string
) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("assistant_id", assistantId)
    .eq("tool_id", toolId)

  if (error) throw new Error(error.message)

  return true
}

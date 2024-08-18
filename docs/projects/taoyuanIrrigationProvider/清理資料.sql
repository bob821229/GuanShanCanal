select * from [dbo].['石管處埤塘基本資料398口']
select * from [dbo].['桃園管理處各貯水池能量表(總表)_修']
select * from [dbo].['桃管處埤塘基本資料284口']
select * from [dbo].['gis-埤塘-石門管理處、桃園管理處']

--clean
delete from [dbo].['桃管處埤塘基本資料284口'] where [埤塘編號] is null

--資料對齊gis資料
update [dbo].['桃管處埤塘基本資料284口']
set [工作站] = [工作站] + '工作站'


--
select * 
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
     inner join [dbo].['桃管處埤塘基本資料284口'] t
             on gis.[埤塘名稱] = t.[埤塘名稱]
                and gis.[工作站名稱] = t.[工作站] --+ '工作站'
        -- on gis.[埤塘名稱] like '%' + t.[埤塘名稱] + '%'


select * 
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
     inner join [dbo].['石管處埤塘基本資料398口'] t
             on gis.[埤塘名稱] = t.[埤塘名稱]
                and gis.[工作站名稱] = t.[工作站] --+ '工作站'

select * from [dbo].['石管處埤塘基本資料398口']

-- select  *
-- from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
-- where gis.管理處名稱 = '石門管理處' and gis.工作站名稱 = '楊梅工作站'

select distinct gis.原水利小組名稱
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis

-- with distinctGisPond as (
--     select distinct [埤塘名稱]
--     from [dbo].['gis-埤塘-石門管理處、桃園管理處']
-- )
-- select * 
-- from distinctGisPond gis
--      inner join [dbo].['桃管處埤塘基本資料284口'] t
--              on gis.[埤塘名稱] = t.[埤塘名稱]
--                 and


select distinct [管理處名稱], [分處名稱], [工作站名稱], [水利小組名稱], [原水利小組名稱], [埤塘名稱]
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
for json path, include_null_values

-- select [埤塘名稱], [工作站], count(*) cc
-- from [dbo].['桃管處埤塘基本資料284口']
-- group by [埤塘名稱], [工作站]
-- order by cc desc


/*產出給firebase的資料*/
select * from [dbo].['gis-埤塘-石門管理處、桃園管理處'] for json path, include_null_values

/*
--replaced by 
select 
    dep1."埤塘編號", 
    dep1."管理處", 
    dep1."工作站", 
    dep1."埤塘名稱", 
    dep1."供水支渠", 
    dep1."支線", 
    dep1."水源別", 
    dep1."行政區", 
    cast(dep1."土地持分比例(%)" as Decimal(18, 8)) "土地持分比例(%)", 
    cast(dep1."埤池面積 (m2)" as Decimal(18, 8)) "埤池面積(m2)", 
    cast(dep1."設計庫容(m3)" as Decimal(18, 8)) "設計庫容(m3)" , 
    cast(dep1."有效庫容(m3)" as Decimal(18, 8)) "有效庫容(m3)" , 
    cast(dep1."灌溉面積(公頃)" as Decimal(18, 8)) "灌溉面積(公頃)", 
    cast(dep1."緯度座標" as Decimal(18, 8)) "緯度座標", 
    cast(dep1."經度座標" as Decimal(18, 8)) "經度座標", 
    dep1."重要濕地", 
    dep1."生態敏感區域", 
    dep1."農業供灌用途", 
    dep1."工業用水用途", 
    dep1."魚介用途", 
    dep1."休憩綠美化用途", 
    dep1."灌溉功能", 
    dep1."備註1", 
    dep1."備註2", 
    cast(pond.[OBJECTID *] as int) OBJECTID, 
    pond.[水利小組名稱], 
    cast(cap.[給水塔底標高(m)] as Decimal(18, 8)) as [給水塔底標高(m)], 
    cast(cap.[滿水位標高(m)] as Decimal(18, 8)) as [滿水位標高(m)], 
    cap.[滿水位], 
        cast(hu.[WaterDepthMaximum] as Decimal(18, 8)) as WaterDepthMaximum, 
        cast(hu.[SurfaceAreaMaximum] as Decimal(18, 8)) as SurfaceAreaMaximum, 
        cast(hu.[WaterStorageMaximum] as Decimal(18, 8)) as WaterStorageMaximum, 
        cast(hu.[DeadWaterHeight] as Decimal(18, 8)) as DeadWaterHeight, 
        cast(hu.[FullWaterHeight] as Decimal(18, 8)) as FullWaterHeight, 
        hu.[FullWaterHeightLoc] as FullWaterHeightLoc, 
        cast(hu.[FieldArea] as Decimal(18, 8)) as FieldArea, 
        hu.[CanalName]
from [dbo].['桃管處埤塘基本資料284口'] dep1 
        inner join [dbo].[BB_6埤塘_1120512_桃管_石管$] pond
                on pond.[工作站名稱] = dep1.[工作站] 
                        and pond.[埤塘名稱] = dep1.[埤塘名稱]
        left join ['桃園管理處各貯水池能量表(總表)_修'] cap
                on cap.[工作站] + '工作站' = pond.[工作站名稱] 
                        and cap.[埤塘編號] = pond.[埤塘名稱]
        left join [dbo].[湖口工作站$] hu
                on hu.PondId = dep1.[埤塘編號]
                        and dep1.[工作站] = '湖口工作站'
--where dep1.[工作站] = '湖口工作站'
for json path, include_null_values
*/
-- SELECT *
-- from [dbo].['桃管處埤塘基本資料284口']

select
        [CanalName]
        ,cast([DeadWaterHeight] as Decimal(18, 8)) [DeadWaterHeight]
        ,cast([FieldArea] as Decimal(18, 8)) [FieldArea]
        ,cast([FullWaterHeight] as Decimal(18, 8)) [FullWaterHeight]
        ,[FullWaterHeightLoc]
        ,[OBJECTID] 
        ,cast([SurfaceAreaMaximum] as Decimal(18, 8)) [SurfaceAreaMaximum]
        ,cast([WaterDepthMaximum] as Decimal(18, 8)) [WaterDepthMaximum]
        ,cast([WaterStorageMaximum] as Decimal(18, 8)) [WaterStorageMaximum]
        ,[休憩綠美化用途] 
        ,[供水支渠] 
        ,[備註1] 
        ,[備註2] 
        ,cast([土地持分比例(%)] as Decimal(18, 8)) [土地持分比例(%)]
        ,[埤塘名稱] 
        ,[埤塘編號] 
        ,cast([埤池面積(m2)] as Decimal(18, 8)) [埤池面積(m2)]
        ,[工作站] 
        ,[工業用水用途] 
        ,[支線] 
        ,cast([有效庫容(m3)] as Decimal(18, 8)) [有效庫容(m3)]
        ,[水利小組名稱] 
        ,[水源別] 
        ,[滿水位] 
        ,cast([滿水位標高(m)] as Decimal(18, 8)) [滿水位標高(m)]
        ,[灌溉功能] 
        ,cast([灌溉面積(公頃)] as Decimal(18, 8)) [灌溉面積(公頃)]
        ,[生態敏感區域] 
        ,[管理處] 
        ,cast([給水塔底標高(m)] as Decimal(18, 8)) [給水塔底標高(m)]
        ,cast([經度座標] as Decimal(18, 8)) [經度座標]
        ,cast([緯度座標] as Decimal(18, 8)) [緯度座標]
        ,[行政區] 
        ,cast([設計庫容(m3)] as Decimal(18, 8)) [設計庫容(m3)] 
        ,[農業供灌用途] 
        ,[重要濕地] 
        ,[魚介用途] 
        ,[F38] 
        ,cast([直灌] as bit) as [直灌]
        ,cast([埤塘]  as bit) as [埤塘]
        ,cast([河水堰]  as bit) as [河水堰]
        ,cast([判釋面積-1期作(公頃)] as Decimal(18, 2)) as [判釋面積-1期作(公頃)]
        ,cast([判釋面積-2期作(公頃)] as Decimal(18, 2)) as [判釋面積-2期作(公頃)]

--from [dbo].[桃園管理處-水利小組-埤塘清單-20240814]
from [dbo].[桃園管理處-水利小組-埤塘清單-20240819]
for json path, include_null_values

-- select distinct cap.[工作站], cap.[埤塘編號]
-- from [dbo].['桃園管理處各貯水池能量表(總表)_修'] cap
--         inner join [dbo].[BB_6埤塘_1120512_桃管_石管$] pond
--                 on cap.[工作站] + '工作站' = pond.[工作站名稱] 
--                         and cap.[埤塘編號] = pond.[埤塘名稱]

-- SELECT *
-- from [dbo].['桃管處埤塘基本資料284口'] dep1 
--         left join [dbo].[湖口工作站$] cap2
--                 on cap2.PondId = dep1.[埤塘編號]

-- select top 1 * from [dbo].['桃管處埤塘基本資料284口']
-- select top 1 * from [dbo].[湖口工作站$]

select mapping.[PondName], hu.PondName , pond.* 
from [dbo].['桃管處埤塘基本資料284口'] pond
        LEFT join [dbo].[各埤塘蓄水量轉換對照表$] mapping
                on pond.[埤塘編號] = mapping.[PondId]
        left join [dbo].[湖口工作站$] hu
                on pond.[埤塘編號] = hu.PondId
where pond.[工作站] = '湖口工作站'
order by hu.PondName, mapping.[PondName]

select [WorkStationId], 
        [PondId], 
        [PondName], 
        cast([WaterDepth] as Decimal(18, 8)) WaterDepth, 
        cast([SurfaceArea] as Decimal(18, 8)) SurfaceArea, 
        cast([WaterStorage] as Decimal(18, 8)) WaterStorage, 
        cast([PercentageOfStorage] as Decimal(18, 15)) PercentageOfStorage, 
        note
from [dbo].[各埤塘蓄水量轉換對照表$]
for json path, include_null_values
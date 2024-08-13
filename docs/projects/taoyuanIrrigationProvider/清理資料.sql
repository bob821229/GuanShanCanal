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
    cap.[給水塔底標高(m)_leon], 
    cap.[滿水位標高(m)_leon], 
    cap.[滿水位_leon], 
    cap.[支渠名稱_leon]
from [dbo].['桃管處埤塘基本資料284口'] dep1 
        inner join [dbo].[BB_6埤塘_1120512_桃管_石管$] pond
                on pond.[工作站名稱] = dep1.[工作站] 
                        and pond.[埤塘名稱] = dep1.[埤塘名稱]
        left join ['桃園管理處各貯水池能量表(總表)_修'] cap
                on cap.[工作站] + '工作站' = pond.[工作站名稱] 
                        and cap.[埤塘編號] = pond.[埤塘名稱]
for json path, include_null_values

SELECT *
from [dbo].['桃管處埤塘基本資料284口']


select distinct cap.[工作站], cap.[埤塘編號]
from [dbo].['桃園管理處各貯水池能量表(總表)_修'] cap
        inner join [dbo].[BB_6埤塘_1120512_桃管_石管$] pond
                on cap.[工作站] + '工作站' = pond.[工作站名稱] 
                        and cap.[埤塘編號] = pond.[埤塘名稱]

